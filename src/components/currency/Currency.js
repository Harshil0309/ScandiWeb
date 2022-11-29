import React, { Component } from "react";
import { connect } from "react-redux";
import DropDown from "../hoc/DropDown";
import style from "./Currency.module.css";
import { updateCurrency as updateCurrencyAction } from "../../redux/actions";
import withRouter from "../hoc/withRouter";
import close from '../../assets/close.png'
import open from '../../assets/open.png'


import {gql} from '@apollo/client'
import {Query} from '@apollo/client/react/components/Query'


const LOAD_CURRENCIES = gql`
  query {
    currencies{
        label
        symbol
    }
  }
`


class Currency extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: null,
    };
  }


  onClickOutside = () => {
    const { toggle } = this.props;
    toggle();
  };

  render() {


    const {
      selectedCurrency,
      isOpen,
      toggle,
      updateCurrencyAction: updateCurrency,
    } = this.props;




    return (
      <div style={{ position: "relative" }}>

        {isOpen === true && (
          <div className={style.backdrop} onClick={this.onClickOutside} />
        )}

        <div className={style["currency-icon-container"]} onClick={toggle}>
          
          {
            selectedCurrency != null && selectedCurrency != undefined &&  <p>{selectedCurrency.symbol}</p>
          }


          {isOpen === false ? (
            <div className={style["svg-container"]}>
              <img src={open}/>
            </div>
          ) : (
            <div className={style["svg-container"]}>
              <img src={close}/>
            </div>
          )}
        </div>



        {isOpen === true && (
          <div className={style["options-container"]}>

            <Query query={LOAD_CURRENCIES} >
              {
                (data) => {
                  if(data.loading) {
                    return <div>Fetching...</div>
                  }
                  else if(data.loading == false){
                    const {currencies} = data.data;
                    return (
                      currencies.map((currency) => (
                        <div
                          className={style.option}
                          onClick={() => {
                            updateCurrency({
                              label: currency.label,
                              symbol: currency.symbol,
                            });
                            toggle();
                          }}
                          key={currency.label}
                        >
                          {currency.symbol} {currency.label}
                        </div>
                      ))
                    )

                  }
                }
              }
            </Query>

           
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedCurrency: state.selectedCurrency,
});

export default withRouter(
  DropDown(connect(mapStateToProps, { updateCurrencyAction })(Currency))
);
