/*

Autor: Rafael Breno Rocha Reis
Copyright All rights reserved


*/


import React, { Component } from 'react'
import './Projeto.css'
import Display from '../components/Display'

const initialState = {
    displayValue: '0',
    companyData: "...",
    companyNews: "...",
    symbol: ''
}

const axios = require('axios')


export default class Projeto extends Component {
    constructor(props) {
        super(props)
        this.buttonJS = this.buttonJS.bind(this)
    }

    state = {
        companyData: "...",
        companyNews: "...",
        displayValue: '0'

    }
    /*
        Função que converte uma data em formato ex: 2019-01-04T22:36:56-05:00 para 04/01/2019
    */
    convertDate(date) {
        var data = new Date(date)
        let day = data.getDate().toString().padStart(2, '0')
        let month = (data.getMonth() + 1).toString().padStart(2, '0')
        let year = data.getFullYear()
        return (day + "/" + month + "/" + year)
    }
    /*
        Função que faz uma requisição do tipo GET da API/Quote para a exibição dos valores
    */
    getQuoteStuffs(path) {
        const getResultfromAPIQuote = axios.get(path)
            .then(response => {
                const quote = response.data
                const displayValue = quote.latestPrice
                this.setState({ displayValue })
            })
            .catch(error => {
                console.log(error)
            })
    }


    /*
        Função que faz uma requisição do tipo GET da API/Company para a exibição dos valores
    */
    getCompanyStuffs(path) {
        const getResultfromAPICompany = axios.get(path)
            .then(response => {
                const company = response.data
                let companyData = `Symbol: ${company.symbol}\nCompany Name: ${company.companyName}\nExchange: ${company.exchange}\nIndustry: ${company.industry}\nWebsite: ${company.website}\nDescription: ${company.description}\nCEO: ${company.CEO}\nIssueType: ${company.issueType}\nSector: ${company.sector}\nTags:`

                for (let i in company.tags) {
                    companyData = companyData + ` ${company.tags[i]} -`
                }

                this.setState({ companyData })
            })
            .catch(error => {
                console.log(error)
            })
    }
    /*
        Função que faz uma requisição do tipo GET da API/New para a exibição dos valores
    */
    getNewsStuffs(path) {
        const getResultfromAPINew = axios.get(path)
            .then(response => {
                const News = response.data
                let companyNews = `Headline: ${News[0].headline}\nSource:${News[0].source}\nData:${this.convertDate(News[0].datetime)}`
                this.setState({ companyNews })
            })
            .catch(error => {
                console.log(error)
            })

    }
    /*
        buttonJS:
        Esta função tem como objetivo principal manipular toda estrutura da aplicação, 
        bem como suas requisições feita pela biblioteca axios e toda operação para a saída
        de dados 
    */
    buttonJS() {
        var sl = prompt("Por Favor digite o simbolo da empresa em questão", "Ex: aapl para Apple, fb para Facebook, twtr para Twitter");
        if (sl == null || sl == "") {
            sl = null
        }
        initialState.symbol = sl
        var mountStringQuote = `https://api.iextrading.com/1.0/stock/${initialState.symbol}/quote`
        var mountStringCompany = `https://api.iextrading.com/1.0/stock/${initialState.symbol}/company`
        var mountStringNew = `https://api.iextrading.com/1.0/stock/${initialState.symbol}/news/last/1`

        this.getQuoteStuffs(mountStringQuote)
        this.getCompanyStuffs(mountStringCompany)
        this.getNewsStuffs(mountStringNew)

    }
    /*
        Função que renderiza os dados na tela
    */
    render() {
        return (
            <div className="projeto">
                <button onClick={this.buttonJS}>Click aqui para inserir o simbolo da empresa</button>
                <h1>Último valor de ação</h1>
                US$
                <Display value={this.state.displayValue} />
                <h1>Dados da empresa</h1>
                <textarea rows="10" cols="40" maxLength="1000" value={this.state.companyData}></textarea>
                <h1>New</h1>
                <textarea rows="10" cols="40" maxLength="1000" value={this.state.companyNews}></textarea>
            </div>
        )
    }
}