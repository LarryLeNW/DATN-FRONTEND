import "./Analytics.css";
import {
    XAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Legend,
    Bar,
    PieChart,
    Pie,
    LineChart,
    YAxis,
    Line,
} from "recharts";

const Analytics = ({
    chart_i,
    chart_ii,
    chart_iii,
    title,
    value,
    illustration,
}) => {
    const data = [
        {
            name: "Sept",
            Earnings: 4000,
            Followers: 2400,
        },
        {
            name: "Oct",
            Earnings: 3000,
            Followers: 1398,
        },
        {
            name: "Nov",
            Earnings: 2000,
            Followers: 9800,
        },
        {
            name: "Dec",
            Earnings: 2780,
            Followers: 3908,
        },
    ];
    const data02 = [
        {
            uv: 4000,
            pv: 2400,
        },
        {
            uv: 3000,
            pv: 1398,
        },
        {
            uv: 2000,
            pv: 4000,
        },
        {
            uv: 2780,
            pv: 3908,
        },
        {
            uv: 1890,
            pv: 2000,
        },
    ];

    const data03 = [
        {
            name: "Group A",
            value: 400,
        },
        {
            name: "Group B",
            value: 300,
        },
        {
            name: "Group C",
            value: 300,
        },
        {
            name: "Group D",
            value: 200,
        },
        {
            name: "Group E",
            value: 278,
        },
        {
            name: "Group F",
            value: 189,
        },
    ];
    const data04 = [
        {
            name: "Group A",
            value: 2000,
        },
        {
            name: "Group B",
            value: 3567,
        },
        {
            name: "Group C",
            value: 598,
        },
        {
            name: "Group D",
            value: 2000,
        },
        {
            name: "Group E",
            value: 1000,
        },
        {
            name: "Group F",
            value: 2500,
        },
    ];
    return (
        <div className="analytics">
            {chart_i && (
                <>
                    <header>
                        <span className="followers">Subcribers:</span>
                        <span className="earnings">Earnings:</span>
                    </header>

                    <BarChart
                        className="chart"
                        width={250}
                        height={210}
                        data={data}
                    >
                        <CartesianGrid strokeDasharray="100 10" />
                        <XAxis dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Followers" fill="#bf2d9d" />
                        <Bar dataKey="Earnings" fill="#21b5a2 " />
                    </BarChart>
                </>
            )}

            {chart_ii && (
                <LineChart
                    width={260}
                    height={220}
                    data={data02}
                    margin={{ right: 10, top: 10 }}
                >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#21b5a2 " />
                    <Line type="monotone" dataKey="uv" stroke="#bf2d9d" />
                </LineChart>
            )}

            {chart_iii && (
                <PieChart width={300} height={300}>
                    <Pie
                        data={data03}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={50}
                        fill="#bf2d9d"
                    />
                    <Pie
                        data={data04}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        fill="#21b5a2 "
                        label
                    />
                </PieChart>
            )}

            {title && (
                <>
                    <h1 className="title">{title}</h1>
                    <h2 className="value">{value}</h2>
                    <h2 className="extra-text">
                        People are loving your content
                        <br />
                        🙌🎉🎆
                    </h2>

                    <img
                        src={illustration}
                        alt="illus"
                        className="illustration"
                    />
                </>
            )}
        </div>
    );
};

export default Analytics;
