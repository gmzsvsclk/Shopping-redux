import React, { useContext } from "react";
import Auth from "../Components/Auth";
import { AuthContext } from "../Context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { validator, authorization } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { email, password } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validator(email, password, dispatch)) {
      await authorization(
        signInWithEmailAndPassword,
        email,
        password,
        dispatch,
        "Giriş Başarılı",
        navigate
      );
    }
  };
  return (
    <Auth
      title="Giriş"
      welcome="Hoş Geldiniz"
      description="Giriş yapın ve alışverişin tadını çıkarın"
      route="Kayıt Ol"
      routeText="Hesabınız yok mu? Kaydolun."
      onSubmit={handleSubmit}
    />
  );
};

export default Login;
