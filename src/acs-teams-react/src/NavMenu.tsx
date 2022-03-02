import React, { Component } from 'react';
import { Collapse, Container, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import './NavMenu.css';

export class NavMenu extends Component<{}, { collapsed: boolean }> {
  static displayName = NavMenu.name;

  constructor(props: any) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <header>

        <Container>
          <Navbar
            color="light"
            expand="md"
            light
          >
            <NavbarBrand href="/">
              ACS/Teams Demo
            </NavbarBrand>
            <NavbarToggler onClick={function noRefCheck() { }} />
            <Collapse navbar>
              <Nav
                className="me-auto"
                navbar
              >
                <NavItem>
                  <NavLink href="/">
                    Call Test
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="https://github.com/sambetts">
                    GitHub
                  </NavLink>
                </NavItem>

              </Nav>
            </Collapse>
          </Navbar>
        </Container>
      </header>
    );
  }
}
