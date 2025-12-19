    import React from 'react'

const PaiementMethod = () => {
  return (
    <div>
    {/* <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Choisissez votre méthode de paiement
        </h3>

        <div className="space-y-4">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                    {...register("paymentMethod")}
                    type="radio"
                    value="mobile_money"
                    className="sr-only"
                />
                <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        selectedPaymentMethod ===
                        "mobile_money"
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300"
                    }`}
                >
                    {selectedPaymentMethod ===
                        "mobile_money" && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                </div>
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">
                            Mobile Money
                        </div>
                        <div className="text-sm text-gray-500">
                            Wave, Orange Money, Free
                            Money
                        </div>
                    </div>
                </div>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                    {...register("paymentMethod")}
                    type="radio"
                    value="card"
                    className="sr-only"
                />
                <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        selectedPaymentMethod === "card"
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300"
                    }`}
                >
                    {selectedPaymentMethod === "card" && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                </div>
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">
                            Carte bancaire
                        </div>
                        <div className="text-sm text-gray-500">
                            Visa, Mastercard
                        </div>
                    </div>
                </div>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                    {...register("paymentMethod")}
                    type="radio"
                    value="bank_transfer"
                    className="sr-only"
                />
                <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        selectedPaymentMethod ===
                        "bank_transfer"
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300"
                    }`}
                >
                    {selectedPaymentMethod ===
                        "bank_transfer" && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                </div>
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">
                            Virement bancaire
                        </div>
                        <div className="text-sm text-gray-500">
                            Transfert direct
                        </div>
                    </div>
                </div>
            </label>
        </div>

        {errors.paymentMethod && (
            <p className="text-red-500 text-sm mt-2">
                {errors.paymentMethod.message}
            </p>
        )}
    </div>

    {selectedPaymentMethod === "mobile_money" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-4">
                Informations Mobile Money
            </h4>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de téléphone
                </label>
                <input
                    type="tel"
                    placeholder="77 XXX XX XX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
            </div>
        </div>
    )}

    {selectedPaymentMethod === "card" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-4">
                Informations de carte
            </h4>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de carte
                    </label>
                    <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date d'expiration
                        </label>
                        <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                        </label>
                        <input
                            type="text"
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>
        </div>
    )} */}
    </div>
  )
}

export default PaiementMethod