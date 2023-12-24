paypal
    .Buttons({
        createOrder: async function () {
            try {
                const response = await fetch('/api/payments/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        payer: 'Nhimcoii',
                        orderId: '000001',
                        payment_method: 'paypal',
                        amount: '10000',
                        currency: 'vnd',
                    }),
                })

                if (!response.ok) {
                    const errorJson = await response.json()
                    throw new Error(errorJson.error)
                }

                const resp = await response.json()
                console.log(resp)
                return resp.data.result
            } catch (error) {
                console.error(error.message)
            }
        },
        onApprove: function (data, actions) {
            console.log(data)
            return actions.order.capture()
        },
    })
    .render('#paypal')

async function handleVNPayPayment() {
    try {
        const resp = await fetch('/api/payments/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                payer: 'Nhimcoii',
                orderId: '000001',
                payment_method: 'vnpay',
                amount: '10000',
                currency: 'vnd',
            }),
        })

        // Check if the request was successful (status code 2xx)
        if (!resp.ok) {
            throw new Error(`Error: ${resp.status} - ${resp.statusText}`)
        }

        // Parse the JSON response
        const { data } = await resp.json()
        const paymentUrl = data.result
        // Redirect the user to the payment URL
        window.location.href = paymentUrl
    } catch (error) {
        console.error('Error:', error.message)
    }
}
