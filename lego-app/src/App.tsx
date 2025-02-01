import React, { useState, useEffect } from "react";
import "./App.css";
import Card from "./components/Card";

type LegoItem = {
    name: string;
    id: string;
    is_in_set: string | null;
    release_year: string;
    number_bricklink_collections: number;
    in_books: number;
    in_sets: number;
    state: string;
    amount: number;
    purchase_date: string | null;
    price: number;
    note: string | null;
    polybag_name: string | null;
    part_of_my_set: string | null;
    theme: string;
    is_set: number;
};

// Default values for missing fields
const DEFAULT_STRING = "-";
const DEFAULT_NUMBER = 0;

// Function to check and clean missing values in a row
const cleanRow = (row: any): LegoItem => {
    return {
        name: row.name || DEFAULT_STRING,
        id: row.id || DEFAULT_STRING,
        is_in_set: row.is_in_set || DEFAULT_STRING,
        release_year: row.release_year || DEFAULT_STRING,
        number_bricklink_collections: row.number_bricklink_collections
            ? parseInt(row.number_bricklink_collections, 10)
            : DEFAULT_NUMBER,
        in_books: row.in_books ? parseInt(row.in_books, 10) : DEFAULT_NUMBER,
        in_sets: row.in_sets ? parseInt(row.in_sets, 10) : DEFAULT_NUMBER,
        state: row.state || DEFAULT_STRING,
        amount: row.amount ? parseInt(row.amount, 10) : DEFAULT_NUMBER,
        purchase_date: row.purchase_date || DEFAULT_STRING,
        price: row.price ? parseFloat(row.price) : DEFAULT_NUMBER,
        note: row.note || DEFAULT_STRING,
        polybag_name: row.polybag_name || DEFAULT_STRING,
        part_of_my_set: row.part_of_my_set || DEFAULT_STRING,
        theme: row.theme || DEFAULT_STRING,
        is_set: row.is_set || DEFAULT_NUMBER,
    };
};

// Mapping for renaming columns
const columnNameMap: Record<string, string> = {
    name: "Name",
    id: "ID",
    is_in_set: "In Sets",
    release_year: "Release Year",
    number_bricklink_collections: "Bricklink Collections",
    in_books: "In Books",
    in_sets: "In Sets (no.)",
    state: "State",
    amount: "Amount",
    purchase_date: "Purchase Date",
    price: "Price",
    note: "Notes",
    polybag_name: "Polybag Name",
    part_of_my_set: "Part of My Set",
    theme: "Theme",
    is_set: "Type", // Will not be displayed
};

// Columns to exclude from the table
const columnsToExclude = ["is_set"];

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"view" | "visual" | "add">(
        "view"
    );
    const [legoData, setLegoData] = useState<LegoItem[]>([]);
    const [filteredData, setFilteredData] = useState<LegoItem[]>([]);
    const [filters, setFilters] = useState({
        release_year: "",
        state: "",
        amount: "",
        theme: "",
        is_set: 0,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [newItem, setNewItem] = useState<LegoItem>({
        name: "",
        id: "",
        is_in_set: null,
        release_year: "",
        number_bricklink_collections: 0,
        in_books: 0,
        in_sets: 0,
        state: "",
        amount: 0,
        purchase_date: null,
        price: 0,
        note: null,
        polybag_name: null,
        part_of_my_set: null,
        theme: "",
        is_set: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/data/lego_data.csv");
            const csvText = await response.text();

            // Parse CSV rows into objects
            const rows = csvText.split("\n").map((row) => row.split(";"));
            const headers = rows[0].map((header) => header.trim());
            const rawData = rows.slice(1).map((row) =>
                row.reduce((obj, value, index) => {
                    obj[headers[index]] = value.trim();
                    return obj;
                }, {} as any)
            );

            // Clean the data for missing values
            const cleanedData = rawData.map(cleanRow);

            setLegoData(cleanedData);
            setFilteredData(cleanedData);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            const filtered = legoData.filter((item) => {
                return (
                    (!filters.release_year ||
                        item.release_year === filters.release_year) &&
                    (!filters.state || item.state === filters.state) &&
                    (!filters.amount ||
                        item.amount === parseInt(filters.amount, 10)) &&
                    (!filters.theme || item.theme === filters.theme) &&
                    (!filters.is_set ||
                        Number(item.is_set ? 1 : 0) === filters.is_set)
                );
            });
            setFilteredData(filtered);
        };

        applyFilters();
    }, [filters, legoData]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = legoData.filter((item) =>
            Object.values(item).join(" ").toLowerCase().includes(query)
        );
        setFilteredData(filtered);
    };

    const handleResetFilters = () => {
        setFilters({
            release_year: "",
            state: "",
            amount: "",
            theme: "",
            is_set: 0,
        });
        setSearchQuery("");
        setFilteredData(legoData);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewItem((prev) => ({
            ...prev,
            [name]:
                name === "is_set"
                    ? value === "true"
                    : [
                          "number_bricklink_collections",
                          "in_books",
                          "in_sets",
                          "amount",
                          "price",
                      ].includes(name)
                    ? parseFloat(value)
                    : value || null,
        }));
    };

    const handleAddItem = () => {
        const cleanedNewItem = cleanRow(newItem);
        setLegoData((prev) => [...prev, cleanedNewItem]);
        setFilteredData((prev) => [...prev, cleanedNewItem]);

        // Reset the form
        setNewItem({
            name: "",
            id: "",
            is_in_set: null,
            release_year: "",
            number_bricklink_collections: 0,
            in_books: 0,
            in_sets: 0,
            state: "",
            amount: 0,
            purchase_date: null,
            price: 0,
            note: null,
            polybag_name: null,
            part_of_my_set: null,
            theme: "",
            is_set: 0,
        });
    };

    const getUniqueValues = (key: keyof LegoItem) => {
        return Array.from(new Set(legoData.map((item) => item[key]))).filter(
            (value) => value !== null && value !== undefined
        );
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>My Lego Database</h1>
            </header>
            <div className="info-bar">
                <p>{filteredData.length} items collected</p>
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            <div className="tabs">
                <button
                    className={`tab ${
                        activeTab === "view" ? "active-tab" : ""
                    }`}
                    onClick={() => setActiveTab("view")}
                >
                    View Items
                </button>
                <button
                    className={`tab ${
                        activeTab === "visual" ? "active-tab" : ""
                    }`}
                    onClick={() => setActiveTab("visual")}
                >
                    Visual Collection
                </button>
                <button
                    className={`tab ${activeTab === "add" ? "active-tab" : ""}`}
                    onClick={() => setActiveTab("add")}
                >
                    Add New Item
                </button>
            </div>

            {/* Conditionally render filters */}
            {(activeTab === "view" || activeTab === "visual") && (
                <div className="filters">
                    <select
                        name="release_year"
                        onChange={handleFilterChange}
                        value={filters.release_year}
                    >
                        <option value="">All Release Years</option>
                        {getUniqueValues("release_year").map((year, index) => (
                            <option key={index} value={year as string}>
                                {year}
                            </option>
                        ))}
                    </select>
                    <select
                        name="state"
                        onChange={handleFilterChange}
                        value={filters.state}
                    >
                        <option value="">All States</option>
                        {getUniqueValues("state").map((state, index) => (
                            <option key={index} value={state as string}>
                                {state}
                            </option>
                        ))}
                    </select>
                    <select
                        name="amount"
                        onChange={handleFilterChange}
                        value={filters.amount}
                    >
                        <option value="">All Amounts</option>
                        {getUniqueValues("amount").map((amount, index) => (
                            <option key={index} value={amount as string}>
                                {amount}
                            </option>
                        ))}
                    </select>
                    <select
                        name="theme"
                        onChange={handleFilterChange}
                        value={filters.theme}
                    >
                        <option value="">All Themes</option>
                        {getUniqueValues("theme").map((theme, index) => (
                            <option key={index} value={theme as string}>
                                {theme}
                            </option>
                        ))}
                    </select>
                    <select
                        name="is_set"
                        onChange={handleFilterChange}
                        value={filters.is_set}
                    >
                        <option value="">All Types</option>
                        <option value="0">Minifigure</option>
                        <option value="1">Set</option>
                    </select>
                    <button
                        className="reset-button"
                        onClick={handleResetFilters}
                    >
                        Reset Filters
                    </button>
                </div>
            )}

            <main className="app-main">
                {activeTab === "view" && (
                    <div className="view-items">
                        <table className="lego-table">
                            <thead>
                                <tr>
                                    {filteredData.length > 0 &&
                                        Object.keys(filteredData[0])
                                            .filter(
                                                (key) =>
                                                    !columnsToExclude.includes(
                                                        key
                                                    )
                                            ) // Exclude columns
                                            .map((key) => (
                                                <th key={key}>
                                                    {columnNameMap[key] || key}{" "}
                                                    {/* Rename column */}
                                                </th>
                                            ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData
                                    // .slice(0, 10)
                                    .map((item, index) => (
                                        <tr key={index}>
                                            {Object.values(item).map(
                                                (value, idx) => (
                                                    <td key={idx}>{value}</td>
                                                )
                                            )}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === "visual" && (
                    <div className="visual-collection">
                        {activeTab === "visual" && (
                            <div className="visual-collection">
                                {filteredData.map((item, index) => (
                                    <Card
                                        key={index}
                                        name={item.name}
                                        id={item.id} // Pass id to load the image
                                        theme={item.theme}
                                        releaseYear={item.release_year}
                                        state={item.state}
                                        amount={item.amount}
                                        price={item.price}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {activeTab === "add" && (
                    <div className="add-item">
                        {Object.keys(newItem)
                            // .filter((key) => !columnsToExclude.includes(key)) // Exclude unwanted columns
                            .map((key) => (
                                <div key={key} className="input-group">
                                    <label htmlFor={key}>
                                        {columnNameMap[key] || key}{" "}
                                        {/* Apply renamed column */}
                                    </label>
                                    <input
                                        type={
                                            [
                                                "price",
                                                "amount",
                                                "number_bricklink_collections",
                                                "in_books",
                                                "in_sets",
                                            ].includes(key)
                                                ? "number"
                                                : "text"
                                        }
                                        id={key}
                                        name={key}
                                        value={(newItem as any)[key] ?? ""}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            ))}
                        <button className="app-button" onClick={handleAddItem}>
                            Add Item
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
