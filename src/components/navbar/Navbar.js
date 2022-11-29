import React, { Component } from "react";
import style from "./Navbar.module.css";
import Navlink from "../navlink/Navlink";
import withRouter from "../hoc/withRouter";
import Currency from "../currency/Currency";
import CartDropDown from "../cartDropdown/CartDropDown";
import logo from '../../assets/logo.png'
import {gql} from '@apollo/client'
import {Query} from '@apollo/client/react/components/Query'


const LOAD_CATEGORIES = gql`
  query{
    categories{
      name
    }
  }
`


class Navbar extends Component {


  constructor(props) {
    super(props);
    const { params } = this.props;
    this.state = {
      activeCategory: params.categoryId || null,
    };
  }

  navlinkClickHandler = (clickedLink) => {
    this.setState((prevState) => {
      return { ...prevState, activeCategory: clickedLink };
    });
  };

  render() {
    return (
      <div className={style.navbar}>
        <div className={style["navbar-links"]}>
          <Query query={LOAD_CATEGORIES}>
            {
              (data) => {
                if(data.loading == true){
                  return <div>Fetching...</div>
                }
                else if(data.loading == false){
                  const { navigate, location } = this.props;
                  const { activeCategory } = this.state;
                  const {categories} = data.data;
                  if(activeCategory == null){
                    this.setState((prevState) => {
                      return {
                        ...prevState,
                        categories: categories,
                        activeCategory: categories[0].name,
                      };
                    });
                  }
                  if (location.pathname === "/") {
                    navigate(`/${categories[0].name}`);
                  }
                  return (
                    categories.map((category) => (
                      <Navlink
                        key={category.name}
                        url={`${category.name}`}
                        text={category.name}
                        isActive={category.name == activeCategory}
                        onClick={this.navlinkClickHandler}
                      />
                    ))
                  )
                }
              }
            }
          </Query>
        </div>
        <div className={style['navbar-logo']}>
          <img src={logo}/>
        </div>
        <div className={style["navbar-icons"]}>
          <Currency />
          <CartDropDown />
        </div>
      </div>
    );
  }
}

export default withRouter(Navbar);
