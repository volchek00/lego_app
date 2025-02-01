const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const csvFilePath = path.join(__dirname, "../public/data/lego_data.csv");

// Endpoint to get all LEGO data
app.get("/api/lego", (req, res) => {
    fs.readFile(csvFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).send("Error reading file");
        res.send(data);
    });
});

// Endpoint to add a new LEGO item
app.post("/api/lego", (req, res) => {
    const newItem = req.body;

    const newRow =
        [
            newItem.name,
            newItem.id,
            newItem.is_in_set,
            newItem.release_year,
            newItem.number_bricklink_collections,
            newItem.in_books,
            newItem.in_sets,
            newItem.state,
            newItem.amount,
            newItem.purchase_date,
            newItem.price,
            newItem.note,
            newItem.polybag_name,
            newItem.part_of_my_set,
            newItem.theme,
            newItem.is_set,
        ].join(";") + "\n";

    fs.appendFile(csvFilePath, newRow, (err) => {
        if (err) return res.status(500).send("Error writing to file");
        res.send("Item added successfully");
    });
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
