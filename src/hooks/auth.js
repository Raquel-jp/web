import React, { createContext, useContext, useCallback, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const AuthProvider = ({children}) => {

  const [data, setData] = useState(() => {
    const token = localStorage.getItem('@Photogram:token');
    const user = localStorage.getItem('@Photogram:user');

    if(token && user){
      api.defaults.headers.authorization = `Bearer ${token}`;
      return {token, user: JSON.parse(user)}
    }

    return {user: null, token: null};
  });

  const signIn = useCallback(async ({username, password}) => {
    const auth = await api.post('/auth', { username, password })

    if(auth.status === 200){
      const { token } = auth.data;
      api.defaults.headers.authorization = `Bearer ${token}`;

      const user = await api.get('/auth/me');

      localStorage.setItem('@Photogram:token', token);
      localStorage.setItem('@Photogram:user', JSON.stringify(user.data));


      setData({
        user: user.data,
        token,
      })
    }
  },[]);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Photogram:token');
    localStorage.removeItem('@Photogram:user');

    setData({
      user: null,
      token: null
    })
  },[])

  return (
    <AuthContext.Provider value={{user: data.user, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  if(!context) throw new Error('useAuth must be used within an AuthProiver');

  return context;
}

export { AuthProvider, useAuth };