# Rozee.pk Jobs Scraper

## Description

This scraper is straightforward and specifically designed to extract job listings from the Rozee.pk website. Built in Node.js using the Puppeteer and Cheerio libraries, it efficiently collects data across multiple pages and saves it to a structured CSV file. Simply replace the job link with a city-specific URL after applying filters and change the file name to suit your needs.Additionally, sample dataset files for several cities are included in the repository. These dataset files are as follows:
- **Bahawalpur** (`Bahawalpur_jobs.csv`)
- **Faisalabad** (`Faisalabad_jobs.csv`)
- **Gujranwala** (`Gujranwala_jobs.csv`)
- **Islamabad** (`Islamabad_jobs.csv`)
- **Karachi** (`Karachi_jobs.csv`)
- **Lahore** (`Lahore_jobs.csv`)
- **Multan** (`Multan_jobs.csv`)
- **Rawalpindi** (`Rawalpindi_jobs.csv`)

## Table of Contents
- [Title](#rozeepk-jobs-scraper)
- [Description](#description)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Notes](#notes)
- [License](#license)
- [Author](#author)

## Features

- Scrapes job data across multiple pages with city-specific filters.
- Collects detailed information such as job titles, company names, skills, and more.
- Supports concurrent tab handling for faster performance.
- Saves output to a CSV file with customizable file names.

## Prerequisites

- Node.js (>=14.0.0)
- npm (Node Package Manager)

1. Clone this repository:

    ```bash
    git clone https://github.com/NomanSiddiqui0000/Rozee.pk-jobs-Scrapper.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Rozee.pk-jobs-Scrapper
    ```

3. Install the required npm packages:

    ```bash
    npm install
    ```

## Usage

1. Open the `rozee.pk_Jobs_Scrapper.js` file and replace the URL in the `mainPage.goto()` function with the filtered job link for your city.
2. Change the output file name in the `csvWriter` path if needed.
3. Run the script:

    ```bash
    node rozee.pk_Jobs_Scrapper.js
    ```

4. The data will be saved in the specified CSV file.

## Configuration

- **City-Specific Filtering**: Replace the default job link with a city-specific filtered link from Rozee.pk.
- **CSV File Path**: Update the file name in the `csvWriter` configuration to save the output as you prefer.

## Notes

- Ensure your internet connection is stable for smooth scraping.
- This script is tailored for Rozee.pk's current structure. Any structural changes on the site may require updating the script.

## License

This project is licensed under the MIT License.

## Author

**Muhammad Noman**
[GitHub Profile](https://github.com/NomanSiddiqui0000)
