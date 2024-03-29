import React, { useEffect } from "react";
import "../scss/cards.scss";
import Card from "./Card";
import { useDispatch, useSelector } from "react-redux";
import { loaderActions } from "../redux/loaderSlice";
import axios from "axios";
import { productsActions } from "../redux/productsSlice";
import { errorActions } from "../redux/errorSlice";

const Cards = () => {
  const dispatch = useDispatch();
  const { productsSearch } = useSelector((state) => state.products);

  const getProducts = async () => {
    dispatch(loaderActions.setLoading(true));
    try {
      const response = await axios.get(
        "https://shopping-redux-5ad57-default-rtdb.firebaseio.com/products.json"
      );
      dispatch(productsActions.setProducts(response.data));
    } catch (err) {
      dispatch(errorActions.setError());
      dispatch(errorActions.setErrorMessage(err.message));
    }
    dispatch(loaderActions.setLoading(false));
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="cards-con">
      {productsSearch ? (
        productsSearch.map((product) => (
          <Card
            key={product.id}
            id={product.id}
            imageSrc={product.image}
            title={product.name}
            price={product.price}
          />
        ))
      ) : (
        <h2>Gösterilecek Ürün Yok !</h2>
      )}
    </div>
  );
};

export default Cards;
