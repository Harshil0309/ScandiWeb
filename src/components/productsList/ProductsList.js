import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import withRouter from "../hoc/withRouter";
import ProductCard from "../productCard/ProductCard";
import { StyledProductsPage } from "./ProductsList.styled";
import { gql } from "@apollo/client"
import {Query} from '@apollo/client/react/components'

const LOAD_PRODUCTS = gql`
  query Category($input : CategoryInput!){
    category(input : $input){
      name
      products {
        id
        name
        brand
        inStock
        gallery
        prices{
          currency {
            label
            symbol
          }
          amount
        }
        attributes{
          id
          name 
          type 
          items {
            id
            displayValue
            value
          }
        }
      }
    }
  }
`


class Products extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { params } = this.props;
    return (
      <StyledProductsPage>
        <div className="product-list__info-container">
          <p>{params.categoryId.toUpperCase()}</p>
        </div>
        <StyledProductsListContainer>
          <Query query={LOAD_PRODUCTS} variables={{input  : {title:params.categoryId}}}>
            {
              (data)=> {
                if(data.loading == true){
                  return <div>Fetching...</div>
                }
                else if(data.loading== false){
                  const {category} = data.data;
                  const {products} = category
                  return (
                    products.map((productItem) => (
                      <ProductCard
                        url={`/${params.categoryId}/${productItem.id}`}
                        key={productItem.name}
                        productDetails={productItem}
                      />
                    ))
                  )
                }
              }
            }
          </Query>
        </StyledProductsListContainer>
      </StyledProductsPage>
    );
  }
}


const StyledProductsListContainer = styled.div`
  margin-top: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 4rem;

  @media (max-width: 675px) {
    & {
      justify-items: center;
    }
  }
`;

const mapStateToProps = () => ({});

export default withRouter(connect(mapStateToProps)(Products));
