import { useState } from "react";
// import ClientNavigationBar from "../shared/ClientNavigationBar";

const ITEMS_PER_PAGE = 5;

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`mx-1 px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
            >
                {page}
            </button>
        ))}
    </div>
);

const TableList = ({ data, columns, title, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} className="border p-2 bg-gray-100">{column.title}</th>
                        ))}
                        <th className="border p-2 bg-gray-100">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((item) => (
                        <tr key={item.id}>
                            {columns.map((column) => (
                                <td key={column.key} className="border p-2">{item[column.key]}</td>
                            ))}
                            <td className="border p-2">
                                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">View</button>
                                <button className="bg-green-500 text-white px-2 py-1 rounded">Download</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
};



const ClientBill = () => {
    const [billsPage, setBillsPage] = useState(1);
    const [invoicesPage, setInvoicesPage] = useState(1);
    const [bills, setBills] = useState([
        { id: 1, date: '2024-03-15', amount: 150, wasteAmount: '50kg', status: 'Pending' },
        { id: 2, date: '2024-03-10', amount: 200, wasteAmount: '75kg', status: 'Paid' },
        { id: 3, date: '2024-03-05', amount: 100, wasteAmount: '30kg', status: 'Overdue' },
        { id: 4, date: '2024-03-01', amount: 175, wasteAmount: '60kg', status: 'Pending' },
        { id: 5, date: '2024-02-25', amount: 225, wasteAmount: '80kg', status: 'Paid' },
        { id: 6, date: '2024-02-20', amount: 125, wasteAmount: '40kg', status: 'Overdue' },
    ]);
    const [invoices, setInvoices] = useState([
        { id: 1, date: '2024-03-15', amount: 150, description: 'Monthly Service', status: 'Unpaid' },
        { id: 2, date: '2024-02-15', amount: 200, description: 'Extra Pickup', status: 'Paid' },
        { id: 3, date: '2024-01-15', amount: 100, description: 'Recycling Fee', status: 'Paid' },
        { id: 4, date: '2024-03-10', amount: 175, description: 'Waste Audit', status: 'Unpaid' },
        { id: 5, date: '2024-02-10', amount: 225, description: 'Quarterly Service', status: 'Paid' },
        { id: 6, date: '2024-01-10', amount: 125, description: 'Special Disposal', status: 'Paid' },
    ]);

    return (
        <div>
            <ClientNavigationBar selected="bill" />
            <div className="bg-gray-100 min-h-screen p-6">

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">Bills & Invoices</h2>
                    <div className="flex justify-between mb-4">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="border rounded px-2 py-1"
                            />
                            <input
                                type="date"
                                className="border rounded px-2 py-1"
                            />
                        </div>
                    </div>

                    <TableList
                        data={bills}
                        columns={[
                            { key: 'date', title: 'Date' },
                            { key: 'amount', title: 'Amount ($)' },
                            { key: 'wasteAmount', title: 'Waste Amount' },
                            { key: 'status', title: 'Status' },
                        ]}
                        title="Bills"
                        currentPage={billsPage}
                        onPageChange={setBillsPage}
                    />

                    <TableList
                        data={invoices}
                        columns={[
                            { key: 'date', title: 'Date' },
                            { key: 'amount', title: 'Amount ($)' },
                            { key: 'description', title: 'Description' },
                            { key: 'status', title: 'Status' },
                        ]}
                        title="Invoices"
                        currentPage={invoicesPage}
                        onPageChange={setInvoicesPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default ClientBill;