import React, { useContext, useEffect, useState } from "react";
import Header from "../Components/Header";
import "../scss/cart.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../Context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { cartActions } from "../redux/cartSlice";
import { notificationActions } from "../redux/notificationSlice";
import Notification from "../Components/Notification";
import { loaderActions } from "../redux/loaderSlice";

const Cart = () => {
  const { cart, totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);

  const getUserCartProducts = async () => {
    try {
      const docRef = doc(db, "usersCarts", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        dispatch(cartActions.setCart(docSnap.data().cart));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProduct = async (productTitle) => {
    const documentRef = doc(db, "usersCarts", currentUser.uid);
    dispatch(loaderActions.setLoading(true));
    try {
      const documentSnapshot = await getDoc(documentRef);

      if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();
        const modifiedArray = data?.cart.filter(
          (item) => item.title !== productTitle
        );

        await updateDoc(documentRef, {
          cart: modifiedArray,
        });
        dispatch(notificationActions.setOpen(true));
        dispatch(notificationActions.setSeverity("success"));
        dispatch(notificationActions.setMessage("Başarıyla silindi"));
      }
    } catch (err) {
      dispatch(notificationActions.setOpen(true));
      dispatch(notificationActions.setSeverity("error"));
      dispatch(notificationActions.setMessage(err.message));
    }
    dispatch(loaderActions.setLoading(false));
  };

  const calculateTotal = () => {
    let totalPrice = 0;
    cart.map((product) => {
      totalPrice += product.quantity * product.price;
      dispatch(cartActions.setTotalPrice(totalPrice));
    });
  };

  const quantityHandler = async (product, op) => {
    dispatch(loaderActions.setLoading(true));
    try {
      const documentRef = doc(db, "usersCarts", currentUser.uid);
      const updatedCart = cart?.map((item) => {
        const quantity = item.quantity + op;
        if (item.id === product.id) {
          return { ...item, quantity: quantity < 1 ? 1 : quantity };
        }
        return item;
      });
      await updateDoc(documentRef, {
        cart: updatedCart,
      });
      dispatch(cartActions.setCart(updatedCart));
    } catch (err) {
      console.log(err);
    }
    dispatch(loaderActions.setLoading(false));
  };

  useEffect(() => {
    getUserCartProducts();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  return (
    <div className="cart">
      <Notification />
      <Header />
      {cart.length > 0 ? (
        <TableContainer className="table-con">
          <Table className="table" aria-label="simple table">
            <TableHead className="table-header-con">
              <TableRow>
                <TableCell className="table-header">Ürünler</TableCell>
                <TableCell className="table-header">Miktar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="tbody">
              {cart.map((product) => (
                <TableRow key={product.id} className="row">
                  <TableCell className="">
                    <div className="product-con">
                      <img src={product.imageSrc} alt="product-image" />
                      <div className="text">
                        <h3>{product.title}</h3>
                        <h3>{product.price}</h3>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="quantity-con">
                      <div className="counter-con">
                        <button
                          onClick={() => quantityHandler(product, -1)}
                          className="counter-btn"
                        >
                          <RemoveIcon className="counter-icon" />
                        </button>
                        <h3>{product.quantity}</h3>
                        <button
                          onClick={() => quantityHandler(product, +1)}
                          className="counter-btn"
                        >
                          <AddIcon className="counter-icon" />
                        </button>
                      </div>
                      <button
                        onClick={() => deleteProduct(product.title)}
                        className="remove-btn"
                      >
                        <DeleteIcon className="remove-icon" />
                        Sil
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <h2 className="total">Toplam Tutar : {totalPrice} TL</h2>
        </TableContainer>
      ) : (
        <h4>Sepet Boş !</h4>
      )}
    </div>
  );
};

export default Cart;
