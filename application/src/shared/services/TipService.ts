type Tip = {
    title: string
    content: string
    source: string
}

/**
 * Hard coded tips
 */
const tips: Tip[] = [
    {
        title: "Rich soil, quality grow",
        content: "Lou says having the best nutrients in your soil will improve the quality of what you grow, start with kitchen and garden scraps.",
        source: "https://www.abc.net.au/everyday/tips-for-growing-fruit-and-vegetables-at-home/10051592",
    },
    {
        title: "Cirtus plants? Use Banana peels",
        content: "Peel a banana skin and put that skin in the soil at the base of the plant and it will really thrive, says Lou.",
        source: "https://www.abc.net.au/everyday/tips-for-growing-fruit-and-vegetables-at-home/10051592",
    },
    {
        title: "Don't forget the lighting",
        content: "Lou says north-facing light is the best, and recommends observing how the sun travels over your garden during the day, which will change with the seasons.",
        source: "https://www.abc.net.au/everyday/tips-for-growing-fruit-and-vegetables-at-home/10051592",
    },
    {
        title: "Don't Squeeze 'em!",
        content: "Overcrowded plants rarely thrive, and lack of air flow can cause fungal problems or invite pest attack.",
        source: "https://www.abc.net.au/everyday/mistakes-new-gardeners-make-and-how-to-avoid-them/11224022",
    },
    {
        title: "Take a step at a time",
        content: "start with something simple and easy as you lack experience, like peas.",
        source: "https://www.abc.net.au/everyday/mistakes-new-gardeners-make-and-how-to-avoid-them/11224022"
    },
    {
        title: "Yellow of old or sick?",
        content: "Older leaves may yellow and fall off. But it can be caused by under-watering, too much sun, or cold draught for the young ones.",
        source: "https://www.abc.net.au/everyday/signs-your-plant-is-struggling-and-how-to-save-them/11324798",
    },
    {
        title: "Beaware of the dots",
        content: "Various fungal and bacterial diseases can cause this, and it spreads rapidly between plants when they are overcrowded. Pick off the infected and throw them into the bin. Mulch the surface with light stones, ensure good airflow, and avoid watering the leaves may help!",
        source: "https://www.abc.net.au/everyday/signs-your-plant-is-struggling-and-how-to-save-them/11324798",
    },
    {
        title: "Time to for a new home",
        content: "Finding roots at surface of soil or coming through drainage holes? The chances are this plant is root-bound and so it will need a larger pot. Gently remove it from its pot to check the roots. If they've started forming circles at the bottom of the pot or there are more roots that soil down the side of the pot, it needs a new home.",
        source: "https://www.abc.net.au/everyday/signs-your-plant-is-struggling-and-how-to-save-them/11324798",
    }
];

/**
 * Get the partially random tip of the day using a sin function.
 * @returns 
 */
export default function GetTodayTip(): Tip {
    const date = new Date(Date.now()).setHours(0, 0, 0, 0)
    let randomNumber = Math.sin(date)
    if (randomNumber < 0) {
        randomNumber = 1 + randomNumber
    }
    return tips[Math.floor(randomNumber * tips.length)]
}