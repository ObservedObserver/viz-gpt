import React, { Fragment, useEffect, useState } from "react";
import Modal from "../modal";
import { CheckIcon } from "@heroicons/react/20/solid";
import { track } from "@vercel/analytics";

const includedFeatures = ["Customized Datasets", "7 X 24 Support", "Connect to other Kanaries Apps", "Latest features"];

interface UpgradeGuideProps {
    showTrigger: {
        current: (show: boolean) => void;
    }
}
const UpgradeGuide: React.FC<UpgradeGuideProps> = props => {
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        props.showTrigger.current = (s: boolean) => {
            setShow(s)
        }
    }, [props.showTrigger])

    return (
        <Fragment>
            <Modal
                show={show}
                onClose={() => {
                    setShow(false);
                }}
            >
                <div className="p-8">
                    <div className="">
                        <div className="mx-auto max-w-7xl px-6 px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 text-4xl">
                                    Analysis your data in Kanaries VizGPT
                                </h2>
                                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                                    Kanaries provides production ready vizGPT and more data apps at{" "}
                                    <a
                                        className="underline text-gray-700 dark:text-gray-300"
                                        href="https://kanaries.net/home/products"
                                    >
                                        kanaries.net
                                    </a>{" "}
                                    It allows your to make more complex analysis to your own datasets.
                                </p>
                            </div>
                            <div className="mx-auto my-6 max-w-2xl rounded-3xl ring-1 ring-gray-200 dark:ring-gray-700 lg:mx-0 lg:flex lg:max-w-none">
                                <div className="p-2 p-6 lg:flex-auto">
                                    <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                                        Kanaries Plus
                                    </h3>
                                    <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                                        Using VizGPT to analysis your own dataset in Kanaries
                                    </p>
                                    <div className="mt-4 flex items-center gap-x-4">
                                        <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400">
                                            What’s included
                                        </h4>
                                        <div className="h-px flex-auto bg-gray-100 dark:bg-gray-700" />
                                    </div>
                                    <ul
                                        role="list"
                                        className="mt-2 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 dark:text-gray-300 sm:grid-cols-2 sm:gap-6"
                                    >
                                        {includedFeatures.map((feature) => (
                                            <li key={feature} className="flex gap-x-3">
                                                <CheckIcon
                                                    className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400"
                                                    aria-hidden="true"
                                                />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="-mt-2 p-2 lg:mt-0 max-w-md flex-shrink-0">
                                    <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 py-4 text-center ring-1 ring-inset ring-gray-900/5">
                                        <div className="mx-auto max-w-xs px-4">
                                            <p className="text-base font-semibold text-gray-600 dark:text-gray-300">
                                                Upgrade to Kanaries Plus
                                            </p>
                                            <p className="mt-6 flex items-baseline justify-center gap-x-2">
                                                <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50">$10</span>
                                                <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600 dark:text-gray-300">
                                                    USD
                                                </span>
                                            </p>
                                            <a
                                                className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                onClick={() => {
                                                    track('kanaries_upgrade')
                                                    setTimeout(() => {
                                                        window.open("https://kanaries.net/home/subscribe", "_blank");
                                                    }, 300)
        
                                                }}
                                            >
                                                Get access
                                            </a>
                                            <p className="mt-6 text-xs leading-5 text-gray-600 dark:text-gray-400">
                                                Use your vizGPT at{" "}
                                                <a
                                                    className="underline text-gray-700 dark:text-gray-300"
                                                    href="https://kanaries.net/home/products"
                                                >
                                                    kanaries.net
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
};

export default UpgradeGuide;
