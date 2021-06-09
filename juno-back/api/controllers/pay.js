const http = require('../../config/http')
const config = require('config')

exports.card = async (req, res) => {
    let charge = await http.post('charges', {
        'charge': {
            ...req.body.product,
            "paymentTypes": ["CREDIT_CARD"]
        },
        'billing' : {
            'name': req.body.name,
            'document': req.body.document
        }
    })
    .then(response => response.data)
    .catch(error => error.response && res.status(400).json(error.response.data.details))
    
    await http.post('payments', {
        "chargeId": charge._embedded.charges[0].id,
        "billing": req.body.billing,
        "creditCardDetails": {
            "creditCardHash": req.body.cardHash
        }
    })
    .then(response => response.data)
    .catch(error => error.response && res.status(400).json(error.response.data.details))

    return res.status(200).json(charge._embedded.charges[0]);
}

exports.boleto = async (req, res) => {
    let charge = await http.post('charges', {
        'charge': {
            ...req.body.product,
            "paymentTypes": ["BOLETO"]
        },
        'billing' : {
            'name': req.body.name,
            'email': req.body.email,
            'document': req.body.document
        }
    })
    .then(response => response.data)
    .catch(error => error.response && res.status(400).json(error.response.data.details))

    return res.status(200).json(charge._embedded.charges[0]);
}

exports.picpay = async (req, res) => {
    let charge = await http.post('charges', {
        'charge': {
            ...req.body.product,
            "paymentTypes": ["CREDIT_CARD"]
        },
        'billing' : {
            'name': req.body.name,
            'document': req.body.document
        }
    })
    .then(response => response.data)
    .catch(error => error.response && res.status(400).json(error.response.data.details))
    
    let today = new Date()
    let vencimento = today.setDate(today.getDate() + 5)
    let picpay = await http.post('qrcode', {
        "chargeCode": charge._embedded.charges[0].code,
        "type": "PICPAY",
        "expiresAt": new Date(vencimento).toISOString().slice(0, 10)
    })
    .then(response => response.data)
    .catch(error => error.response && res.status(400).json(error.response.data.details))

    return res.status(200).json(picpay);
}

exports.pix = async (req, res) => {
    let charge = await http.post('pix/qrcodes/static', {
        'includeImage': true,
        'key': config.get('pix-key'),
        'amount': req.body.product.amount,
        'reference': req.body.product.title,
        'additionalData': req.body.product.title
    })
    .then(response => response.data)
    .catch(error => error.response && res.status(400).json(error.response.data.details))
    
    return res.status(200).json(charge);
}


exports.charge = async (req, res) => {
    let charge = await http.get('charges/'+req.params.id)
    .then(response => response.data)
    .catch(error => error.response && res.status(400).json(error.response.data.details))

    return res.status(200).json(charge);
}