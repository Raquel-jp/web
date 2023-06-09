import React, { useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import gif from '../../assets/mobilegif.gif';
//import logo from '../../assets/logo.svg';

import Input from '../../components/Input';

import { Container, Gif, FromContainer, Form, Footer } from './styles';

const SignUp = () => {
  const history = useHistory();
  const formRef = useRef(null);

  const handleSubmit = useCallback( async (data) => {
    try{
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nombre obligatorio'),
          email: Yup.string().required('Correo obligatorio').email('Correo inválido'),
          username: Yup.string().required('Username obligatorio'),
          password: Yup.string().required('Password obligatorio').min(6, 'El password debe ser de máximo 6 dígitos'),
        })

        await schema.validate(data, { abortEarly: false });

        await api.post('/users', data);

        toast.success('Te registraste con éxito!')

        history.push('/signin');

    }catch (error) {
      if(error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current.setErrors(errors);
        return;
      }

      toast.error(error.response.data.message);
    }
  } ,[history])

  return (
    <Container>
      <Gif src={gif} alt="gif" />

      <FromContainer>
        <Form ref={formRef} onSubmit={handleSubmit} >
          <h1>Finstagram</h1>
          <span>Registrate para ver fotos y videos de tus amigos</span>

          <hr />

          <Input name="name" placeholder="Ingrese su nombrecompleto" />
          <Input name="email" placeholder="Ingrese su correo electrónico" />
          <Input name="username" placeholder="Escoja algún usuario" />
          <Input type="password" name="password" placeholder="Ingrese alguna contraseña" />

          <button type="submit">Regístrate</button>

          <hr />


          <span className="footer">
            Al registrarte, aceptas nuestras Condiciones, la Política de datos y la Política de cookies
          </span>

        </Form>

        <Footer>
          <p>
            ¿Tienes una cuenta? <Link to="signin">Entrar</Link>
          </p>
        </Footer>
      </FromContainer>
    </Container>
  )
}

export default SignUp;