import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../../hooks/auth';

import SearchContainer from '../Search';

//import logo from '../../assets/logo.svg';

import { Nav, Container,  ContainerSearch, Input, ContainerOptions } from './styles';
import ModalUploadPhoto from '../Modal/ModalUploadPhotp';
import { useSearch } from '../../hooks/search';

let time = null;

const Header = () => {
  const { user, signOut } = useAuth()
  const { searchAction, setUsers, setLoading } = useSearch();
  const [term , setTerm] = useState('');

  useEffect(() => {
    clearTimeout(time);

    if(term.trim()){
      setLoading(true);
      time = setTimeout(() =>{
        searchAction(term);
      },1000)

    }

    return () => {
      setUsers([]);
    }
  },[searchAction, setLoading, setUsers, term])

  const toggleClose = useCallback(() => {
    setTerm("");
  },[]);

  return (
    <Nav>
      <Container>
        <Link to="/">
         <h1>Finstagram</h1>
        </Link>
      

      <ContainerSearch>
        <FaSearch color="#ccc" size={15} />
        <Input placeholder="Buscar" value={term} onChange={(e) => setTerm(e.target.value)} />
        {term.length > 0 && <SearchContainer toggleClose={toggleClose} />}
      </ContainerSearch>

      <ContainerOptions>
        <ModalUploadPhoto />

        <Link to={`/profile/${user.username}`} style={{marginLeft: '15px'}}>
          <FaUser color="#222" size={25}/>
        </Link>

        <FaSignOutAlt color="#222" size={25} onClick={signOut} />
        

      </ContainerOptions>

      </Container>
    </Nav>
  )
}

export default Header;