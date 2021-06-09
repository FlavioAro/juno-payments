import React from 'react'
import { MdAspectRatio, MdCreditCard, MdViewWeek } from 'react-icons/md'
import { FaQrcode } from 'react-icons/fa'

import { payPix } from '../../store/actions/payment.action'
import product from '../../product.json'
import { useDispatch } from 'react-redux'
import Pix from './pix'

export default function Checkout() {

    const dispatch = useDispatch()

    const [ state, setState ] = React.useState({})
    const [ modal, setModal ] = React.useState({
        open: true
    })

    return (
        <div className="container mt-4 pt-3">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h3 className="font-weight-normal mb-4">Pagamento</h3>

                    <div className="card card-body">
                        <div className="mb-3">
                            <label className="label-custom">Como você prefere pagar?</label>
                        </div>

                        <a href="/card">
                            <div className="d-flex pointer">
                                <MdCreditCard className="display-4" />
                                <div className="ms-4 d-flex flex-column align-items-center">
                                    <label className="h5 mb-1 me-auto">Cartão</label>
                                    <label className="text-muted me-auto">Crédito</label>
                                </div>
                            </div>
                        </a>

                        <hr />

                        <a href="/boleto">
                            <div className="d-flex pointer">
                                <MdViewWeek className="display-4" />
                                <div className="ms-4 d-flex flex-column align-items-center">
                                    <label className="h5 mb-1 me-auto">Boleto bancário</label>
                                    <label className="text-muted me-auto">O pagamento será aprovado em 1 ou 3 dias uteis</label>
                                </div>
                            </div>
                        </a>

                        <hr />

                        <a href="/picpay">
                            <div className="d-flex pointer">
                                <MdAspectRatio className="display-4" />
                                <div className="ms-4 d-flex flex-column align-items-center">
                                    <label className="h5 mb-1 me-auto">PIC PAY</label>
                                    <label className="text-muted me-auto">Pague via QR Code com Pic pay</label>
                                </div>
                            </div>
                        </a>

                        <hr />

                        <div className="pointer" onClick={() => dispatch(payPix({ product: product })).then(
                            res => {
                                if(res.id) {
                                    setModal({open: true })
                                    setState(res)
                                }
                            }) 
                        }>
                            <div className="d-flex pointer">
                                <FaQrcode className="display-4" />
                                <div className="ms-4 d-flex flex-column align-items-center">
                                    <label className="h5 mb-1 me-auto">PIX</label>
                                    <label className="text-muted me-auto">Pague via QR Code com PIX</label>
                                </div>
                            </div>
                        </div>

                        {(state.id) && 
                            <Pix
                                open={modal.open}
                                onClose={() => setModal({ open: false })}
                                pix={state} 
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}