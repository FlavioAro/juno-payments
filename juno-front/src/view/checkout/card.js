import React from 'react'
import { Button, CircularProgress, InputAdornment, TextField } from '@material-ui/core'
import { MdCreditCard, MdEmail } from 'react-icons/md'
import MaskedInput from 'react-text-mask'
import { useDispatch, useSelector } from 'react-redux'
import { changeNotify } from '../../store/actions/notify.action'
import { getCep, payCard } from '../../store/actions/payment.action'
import product from '../../product.json'
import { Redirect } from 'react-router'

const TextMaskCustom = (props) => {
    const { inputRef, ...other } = props;
    let mask = [];

    if (props.id === 'cardNumber') {
        mask = [/[0-9]/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    }

    if (props.id === 'cardExpiration') {
        mask = [/[0-9]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,];
    }

    if (props.id === 'securityCode') {
        mask = [/[0-9]/, /\d/, /\d/];
    }

    if (props.id === 'cpf') {
        mask = [/[0-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]
    }

    if (props.name === 'cep') {
        mask = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
    }

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null)
            }}
            mask={mask}
            guide={false}
        />
    )
}

export default function Card() {
    const dispatch = useDispatch()
    const success = useSelector(state => state.paymentReducer.success)

    const [card, setCard] = React.useState({
        cardNumber: '',
        holderName: '',
        securityCode: '',
        expirationMonth: '',
        expirationYear: ''
    })

    const [address, setAddress] = React.useState({})
    const [isLoadingCep, setLoadingCep] = React.useState(false)
    var checkout;

    React.useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://sandbox.boletobancario.com/boletofacil/wro/direct-checkout.min.js'

        script.addEventListener('load', () => {
            checkout = new window.DirectCheckout('A8A62880FA2500AE20C381201AB10ACA0866D7B83E7DF8068B91EDD957AAB0E4', false)
        })
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    })

    const generateHash = () => {
        checkout.getCardHash({
            cardNumber: card.cardNumber && card.cardNumber.replace(/[^0-9]/g, ''),
            holderName: card.holderName,
            securityCode: card.securityCode,
            expirationMonth: card.expirationMonth,
            expirationYear: card.expirationYear
        }, function (cardHash) {
            dispatch(payCard({
                product: product,
                billing: {
                    email: card.email,
                    address: {
                        number: address.number,
                        street: address.logradouro,
                        neighborhood: address.bairro,
                        city: address.localidade,
                        state: address.uf,
                        postCode: address.cep && address.cep.replace(/[.-]/g, '')
                    }
                },
                cardHash: cardHash,
                document: card.document,
                name: card.holderName
            }))
        }, function (error) {
            dispatch(changeNotify({
                open: true,
                msg: error.message
            }))
        });
    }

    const _cardExpiration = (value) => {
        if (value.length === 7) {
            let cardExpiration = value.split('/')
            setCard({
                ...card,
                cardExpiration: value,
                expirationMonth: cardExpiration[0],
                expirationYear: cardExpiration[1],

            })
        } else {
            setCard({
                ...card,
                cardExpiration: value
            })
        }
    }

    return (
        <div className="container mt-4 pt-3">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h5 className="font-weight-normal mb-4 mt-4">Endereço</h5>

                    <div className="card card-body">
                        <div className="mb-3">
                            <label className="label-custom">CEP</label>
                            <TextField
                                style={(isLoadingCep) ? { opacity: 0.5 } : {}}
                                type="tel"
                                name="cep"
                                InputProps={{
                                    inputComponent: TextMaskCustom,
                                    value: address.cep,
                                    onChange: text => {
                                        setAddress({
                                            ...address,
                                            cep: text.target.value
                                        })
                                        if (text.target.value.length > 8) {
                                            setLoadingCep(true)
                                            dispatch(getCep(text.target.value)).then(res => {
                                                setAddress(res)
                                                setLoadingCep(false)
                                            })
                                        }
                                    },
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            {(isLoadingCep) ? <CircularProgress size={32} /> : <></>}
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-9">
                                <div className="mb-3">
                                    <label className="label-custom">CIDADE</label>
                                    <TextField
                                        disabled
                                        value={address.localidade || ''}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="label-custom">UF</label>
                                    <TextField
                                        disabled
                                        value={address.uf || ''}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="label-custom">BAIRRO</label>
                            <TextField
                                value={address.bairro || ''}
                                onChange={text =>
                                    setAddress({
                                        ...address,
                                        bairro: text.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-9">
                                <div className="mb-3">
                                    <label className="label-custom">RUA</label>
                                    <TextField
                                        value={address.logradouro || ''}
                                        onChange={text =>
                                            setAddress({
                                                ...address,
                                                logradouro: text.target.value
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="label-custom">N°</label>
                                    <TextField
                                        value={address.number || ''}
                                        onChange={text =>
                                            setAddress({
                                                ...address,
                                                number: text.target.value
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <h5 className="font-weight-normal mb-4 mt-4">Dados do cartão</h5>

                    <div className="card card-body">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="mb-3">
                                    <label className="label-custom">Número do cartão</label>
                                    <TextField
                                        id="cardNumber"
                                        type="tel"
                                        InputProps={{
                                            inputComponent: TextMaskCustom,
                                            value: card.cardNumber,
                                            placeholder: '____ ____ ____ ____',
                                            autoComplete: 'off',
                                            onChange: text => {
                                                setCard({
                                                    ...card,
                                                    cardNumber: text.target.value
                                                })
                                            },
                                            startAdornment: (
                                                <InputAdornment>
                                                    <MdCreditCard style={{ fontSize: '1.5rem' }} className="me-2 text-muted" />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="col-6 col-md-4">
                                <div className="mb-3">
                                    <label className="label-custom">Vencimento</label>
                                    <TextField
                                        id="cardExpiration"
                                        type="tel"
                                        InputProps={{
                                            inputComponent: TextMaskCustom,
                                            value: card.cardExpiration,
                                            autoComplete: 'off',
                                            onChange: text => _cardExpiration(text.target.value)
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="col-md-8 order-1 order-md-0">
                                <div className="mb-3">
                                    <label className="label-custom">Nome impresso no cartão</label>
                                    <TextField
                                        value={card.holderName || ''}
                                        autoComplete="off"
                                        onChange={text => setCard({ ...card, holderName: text.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="col-6 col-md-4">
                                <div className="mb-3">
                                    <label className="label-custom">CVV</label>
                                    <TextField
                                        id="securityCode"
                                        InputProps={{
                                            inputComponent: TextMaskCustom,
                                            value: card.securityCode,
                                            autoComplete: 'off',
                                            type: 'tel',
                                            onChange: text => setCard({ ...card, securityCode: text.target.value }),
                                            endAdornment: (
                                                <InputAdornment>
                                                    <div className="cvv_info" />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="label-custom">Email</label>
                                <TextField
                                    value={card.email || ''}
                                    autoComplete="off"
                                    type="email"
                                    onChange={text => setCard({ ...card, email: text.target.value })}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment>
                                                <MdEmail style={{ fontSize: '1.5rem' }} className="me-2 text-muted" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="label-custom">CPF</label>
                                <TextField
                                    autoComplete="off"
                                    id="cpf"
                                    InputProps={{
                                        inputComponent: TextMaskCustom,
                                        value: card.cpf,
                                        type: 'tel',
                                        placeholder: '___.___.___-__',
                                        onChange: text => setCard({
                                            ...card,
                                            cpf: text.target.value,
                                            document: text.target.value.replace(/[.-]/g, '')
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            className="mt-4 mb-4 font-weight-bold"
                            onClick={() => generateHash()}
                        >
                            Realizar pagamento
                        </Button>

                        {(success) &&
                            <Redirect to={'/charge/'+success}/>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
