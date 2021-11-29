import React, { useState, useRef, useEffect } from 'react';
import '../index.css';
import logo from '../media/logo.jpg'
import { useWeb3React } from '@web3-react/core'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import Web3 from 'web3'
import { injected } from './wallet/connector';
import Auth from '@aws-amplify/auth';


import { Navbar, Nav, Container, Row, Col, NavDropdown, Image } from 'react-bootstrap'
function Header() {
    var[user, setUser]= useState('')
    Auth.currentAuthenticatedUser().then(userinfo => setUser(userinfo.username)).catch(err => console.log(err))

    const { active, account, library, connector, activate, deactivate } = useWeb3React()

    async function connect() {
        try {
            await activate(injected)
        } catch (ex) {
            console.log(ex)
        }
    }

    async function disconnect() {
        try {
            deactivate()
        } catch (ex) {
            console.log(ex)
        }
    }
    return (

        <header>
            <Navbar bg="dark" variant="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/"><h1 style={{ fontFamily: "Raleway, sans-serif", color: "#3ab8c5", paddingLeft: "5px", WebkitTextStrokeWidth: ".5px", WebkitTextStrokeColor: "#6f42c1", border: "1px white solid", padding: "6px 10px 10px 10px", borderRadius: "5px" }} > <span style={{ fontSize: "2.8rem" }}>tg</span>ether</h1></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" style={{ color: "white" }}>
                        <Nav className="me-auto">
                            <Nav.Link href="#home" className="btn btn btn-primary p-3 m-2 text-white">Add Friends</Nav.Link>
                            <Nav.Link href="#link" className="btn btn btn-primary p-3 m-2 text-white ">Contracts</Nav.Link>

                        </Nav>
                        <Nav className="pull-right btn-group">
                            <Nav.Link href="#link" onClick={connect} className="btn btn-secondary p-3 text-white">{active ? <span>Wallet Connected</span> : <span>Connect Your Wallet</span>}</Nav.Link>
                            
                            <NavDropdown title={<i className="fas fa-user text-white"> </i>} className="btn btn-secondary" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3"> </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4"><AmplifySignOut /></NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>





        </header>


    )
}

export default Header
