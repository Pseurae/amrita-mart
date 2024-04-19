"use client"

import { useUser } from "../../_context/user";
import { FormEvent, useEffect, useState } from "react";
import { cakes } from "./_lib/common";
import CakeButton from "./_components/CakeButton";
import Modal from '../_components/Modal'

export default function () {
    const { addCakeOrder, hasLoggedIn } = useUser();
    const [type, setType] = useState(0);
    const [message, setMessage] = useState("");
    const [quantity, setQuantity] = useState<number | null>(0.0);

    const [customQuantity, setCustomQuantity] = useState<number>(1.0);
    const [customQuantityError, setCustomQuantityError] = useState(false);

    const [candlesRequest, setCandlesRequest] = useState(false);
    const [otherRequest, setOtherRequest] = useState("");

    const [modalOpened, setModalOpened] = useState(false);

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isNaN(customQuantity) || (customQuantity < 1 || customQuantity > 10)) setCustomQuantityError(true);
        else setCustomQuantityError(false);
    }, [customQuantity])

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        setModalOpened(false);
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/order/cake/create/', {
                method: 'POST',
                body: JSON.stringify({
                    type: cakes[type]._id,
                    message,
                    quantity: quantity || customQuantity,
                    need_candle: candlesRequest,
                    other_request: otherRequest
                }),
            });

            await response.json().then(data => addCakeOrder(data.id));

            if (!response.ok) {
                throw new Error('Failed to submit the data. Please try again.')
            }
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mx-auto py-5">
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
                <h1 className="font-medium text-lg">Which cake do you want?</h1>

                <ul className="grid grid-flow-col auto-cols-fr gap-5 w-fit">
                    {cakes.map((cake, i) => (
                        <li key={cake._id}>
                            <CakeButton cake={cake} checked={type == i} onChange={() => setType(i)} />
                        </li>
                    ))}
                </ul>

                <input className="outline-none border p-3 rounded focus:border-blue-400" type="text" placeholder="Message on the cake..." name="cakeMessage" id="cakeMessage" value={message} onChange={(e) => setMessage(e.target.value)} />

                <div className="flex flex-col gap-1">
                    <h1 className="font-medium text-lg">How much cake do you want? (in Kgs)</h1>

                    <div className="grid grid-flow-col w-fit items-center">
                        <select name="quantity" id="" className="outline-none border rounded p-2" onChange={(e) => setQuantity(JSON.parse(e.target.value))}>
                            {[1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0].map((i) => (
                                <option key={i} value={i}>{i}</option>
                            ))}

                            <option key="custom" value="null">Custom</option>
                        </select>

                        {quantity == null ?
                            (<span>
                                <input type="number" name="customQuantity" className="w-24 ml-5 mr-2 outline-none border rounded px-2 py-1.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={customQuantity} onChange={(e) => setCustomQuantity(e.target.valueAsNumber)} />
                                Kg

                                {customQuantityError && <span className="ml-5 text-red-400">Custom quantity should be from 1 to 10 Kgs!</span>}
                            </span>) :
                            (<span className="ml-2">Kg</span>)
                        }

                        <p className="ml-4 font-semibold">₹{cakes[type].price * (quantity || customQuantity)}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <h1 className="font-medium text-lg">Do you need candles and matches?</h1>

                    <div className="grid grid-flow-col w-fit gap-5">
                        <label>
                            <input type="radio" name="needCandles" value="true" checked={candlesRequest == true} onChange={() => setCandlesRequest(true)} /> Yes
                        </label>

                        <label>
                            <input type="radio" name="needCandles" value="false" checked={candlesRequest == false} onChange={() => setCandlesRequest(false)} /> No
                        </label>
                    </div>
                </div>

                <textarea placeholder="Other specific requests..." name="otherRequest" id="" cols={50} rows={10} className="outline-none border p-3 rounded resize-none focus:border-blue-400" value={otherRequest} onChange={(e) => setOtherRequest(e.target.value)}></textarea>

                <input type="button" className="bg-red-700 text-white font-semibold rounded px-5 py-2 disabled:bg-slate-400 disabled:cursor-not-allowed enabled:cursor-pointer" value={hasLoggedIn ? (isLoading ? "Loading..." : "Submit Cake Request") : "Please login to your account."} disabled={!hasLoggedIn || isLoading || (quantity == null && customQuantityError)} onClick={() => setModalOpened(true)} />

                <Modal isModalOpen={modalOpened} closeModal={() => setModalOpened(false)} parentStyles="grid place-content-center bg-black/[0.6]">
                    <div className="bg-white rounded-lg z-50 p-12 flex flex-col gap-3">
                        <div className="mb-3">
                            <h1 className="text-center text-2xl mb-2 font-semibold">Please confirm your order.</h1>
                            <h2 className="text-center text-lg font-medium text-black text-opacity-60">You cannot make modifications to this order later on.</h2>
                        </div>

                        <button className="transition border-2 border-green-500 hover:text-white hover:bg-green-500 font-semibold rounded-full py-2.5" type="submit">Confirm</button>
                        <button className="transition border-2 border-red-500 hover:text-white hover:bg-red-500 font-semibold rounded-full py-2.5" onClick={() => setModalOpened(false)}>Close</button>
                    </div>
                </Modal>
            </form>
        </div>
    )
}
