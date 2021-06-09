import { Http } from '../../config/Http'
import { changeLoading } from './loading.action'
import { changeNotify } from './notify.action'

export const actionTypes = {
    SHOW: 'TRANSACTIONS_SHOW',
    SUCCESS: 'PAYMENT_SUCCESS'
}

export const success = (payload) => ({
    type: actionTypes.SUCCESS,
    payload
})

/* PAY CARD */

export const payCard = (data) => dispatch => {
    dispatch(changeLoading({
        open: true,
        msg: 'Processando pagamento...'
    }))
    return Http.post('/payment/card', data)
        .then(res => {
            dispatch(changeLoading({open: false}))

            if(typeof res !== 'undefined') {
                dispatch(success(res.data.id))
            }
        })
        .catch(error => {
            dispatch(changeLoading({open: false}))
            if(error.response) {
                dispatch(changeNotify({
                    open: true,
                    msg: error.response.data[0].message
                }))
            }
        })
}

/* PAY BOLETO */

export const payBoleto = (data) => dispatch => {
    dispatch(changeLoading({
        open: true,
        msg: 'Processando pagamento...'
    }))
    return Http.post('/payment/boleto', data)
        .then(res => {
            dispatch(changeLoading({open: false}))

            if(typeof res !== 'undefined') {
                dispatch(success(res.data.id))
            }
        })
        .catch(error => {
            dispatch(changeLoading({open: false}))
            if(error.response) {
                dispatch(changeNotify({
                    open: true,
                    msg: error.response.data[0].message
                }))
            }
        })
}

/* PAY PIC PAY */

export const payPicpay = (data) => dispatch => {
    dispatch(changeLoading({
        open: true,
        msg: 'Processando pagamento...'
    }))
    return Http.post('/payment/picpay', data)
        .then(res => {
            dispatch(changeLoading({open: false}))

            if(typeof res !== 'undefined') {
                window.open(res.data.paymentUrl, '_blank')
                dispatch(success(res.data.paymentUrl))
            }
        })
        .catch(error => {
            dispatch(changeLoading({open: false}))
            if(error.response) {
                dispatch(changeNotify({
                    open: true,
                    msg: error.response.data[0].message
                }))
            }
        })
}

/* PAY PIX */

export const payPix = (data) => dispatch => {
    dispatch(changeLoading({
        open: true,
        msg: 'Processando pagamento...'
    }))
    return Http.post('/payment/pix', data)
        .then(res => {
            dispatch(changeLoading({open: false}))
            if(typeof res !== 'undefined') {
                return res.data
            }
        })
        .catch(error => {
            dispatch(changeLoading({open: false}))
            if(error.response) {
                dispatch(changeNotify({
                    open: true,
                    msg: error.response.data[0].message
                }))
            }
        })
}

/* TRANSACTION SHOW */

export const showResponse = (payload) => ({
    type: actionTypes.SHOW,
    payload
})

export const show = (id) => dispatch => {
    return Http.get('/payment/charge/'+ id)
        .then(res => typeof res !== 'undefined' && dispatch(showResponse(res.data)))
}

export const getCep = (cep) => dispatch => {
    return Http.get('https://viacep.com.br/ws/'+cep+'/json')
        .then(res => {
            if(typeof res !== 'undefined') {
                return res.data
            }
        })
}