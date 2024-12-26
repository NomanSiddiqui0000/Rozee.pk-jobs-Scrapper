const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: 'Bahawalpur_jobs.csv',
    header: [
        { id: 'Job_title', title: 'Job Title' },
        { id: 'Job_link', title: 'Job Link' },
        { id: 'Company_Name', title: 'Company Name' },
        { id: 'Company_link', title: 'Company Link' },
        { id: 'Location', title: 'Location' },
        { id: 'Salary', title: 'Salary' },
        { id: 'Job_Views', title: 'Job Views' },
        { id: 'Time_of_post', title: 'Time of Post' },
        { id: 'Job_Description', title: 'Job Description' },
        { id: 'Skills_Required', title: 'Skills Required' },
        { id: 'Job_Industry', title: 'Job Industry' },
        { id: 'Functional_Area', title: 'Functional Area' },
        { id: 'Total_positions', title: 'Total Positions' },
        { id: 'Job_Shift', title: 'Job Shift' },
        { id: 'Job_type', title: 'Job Type' },
        { id: 'Job_Location', title: 'Job Location' },
        { id: 'Gender', title: 'Gender' },
        { id: 'Minimum_Education', title: 'Minimum Education' },
        { id: 'Career_Level', title: 'Career Level' },
        { id: 'Minimum_Experience', title: 'Minimum Experience' },
        { id: 'Apply_Before', title: 'Apply Before' },
        { id: 'Posting_Date', title: 'Posting Date' }
    ],
    append: true // Appends data to the file rather than overwriting it
});

(async () => {
    const browser = await puppeteer.launch();
    const mainPage = await browser.newPage();
    await mainPage.goto('https://www.rozee.pk/job/jsearch/q/all/fc/2023', { waitUntil: 'domcontentloaded' });

    const maxConcurrentTabs = 3;

    do {
        // Wait for job listings to load
        await mainPage.waitForSelector('h3.s-18 a');

        // Extract all job links from the current page
        let jobLinks = await mainPage.$$eval('h3.s-18 a', (anchors) => anchors.map(a => a.href));
        console.log(`Found ${jobLinks.length} job links on the current page.`);

        // Process jobs in batches of three using multiple tabs
        while (jobLinks.length > 0) {
            const batchLinks = jobLinks.splice(0, maxConcurrentTabs);
            const tabs = await Promise.all(batchLinks.map(() => browser.newPage()));

            await Promise.all(
                batchLinks.map(async (link, index) => {
                    const tab = tabs[index];
                    try {
                        await tab.goto(link, { waitUntil: 'domcontentloaded' });

                        const content = await tab.content();
                        const $ = cheerio.load(content);

                        const jobInfo = {
                            Job_title: $('h1.jtitle.font24.text-dark > bdi').text().trim() || 'Null',
                            Job_link: link,
                            Company_Name: $('h2.cname a bdi').text().trim() || 'Null',
                            Company_link: $('h2.cname a').attr('href') || 'Null',
                            Location: $('h4.lh1.cname').text().split(',')[0].trim() || 'Null',
                            Salary: $('div.mrsl.mt10.ofa.font18.text-right.text-dark.d-flex.align-items-center').text().trim() || 'N/A',
                            Job_Views: $('span.font16.mr-3.d-flex.align-items-center span').last().text().trim() || 'Null',
                            Time_of_post: $('span.font16 span').first().text().trim().split('views')[0].trim() || 'Null',
                            Job_Description: $('#jbDetail .jblk ul18 p').map(function () { return $(this).text().trim(); }).get().join(' ') || 'Null',
                            Skills_Required: $('div.jblk h4:contains("Skills") + div.jcnt a').map((_, el) => $(el).text().trim()).get() || "Null",
                            Job_Industry: $('b:contains("Industry:")').closest('.row').find('.jblk').text().trim() || 'N/A',
                            Functional_Area: $('b:contains("Functional Area:")').closest('.row').find('.jblk').text().trim() || 'N/A',
                            Total_positions: $('b:contains("Total Positions:")').closest('.row').find('div.col-lg-7').text().trim() || 'N/A',
                            Job_Shift: $('b:contains("Job Shift:")').closest('.row').find('bdi').text().trim() || 'N/A',
                            Job_type: $('b:contains("Job Type:")').closest('.row').find('.jblk').map((i, el) => $(el).text().trim()).get().join('/') || 'N/A',
                            Job_Location: $('b:contains("Job Location:")').closest('.row').find('.jblk span').map((i, el) => $(el).text().trim()).get().join(', ') || 'N/A',
                            Gender: $('b:contains("Gender:")').closest('.row').find('div.col-lg-7').text().trim() || 'N/A',
                            Minimum_Education: $('b:contains("Minimum Education:")').closest('.row').find('div.col-lg-7').text().trim() || 'N/A',
                            Career_Level: $('b:contains("Career Level:")').closest('.row').find('div.col-lg-7').text().trim() || 'N/A',
                            Minimum_Experience: $('b:contains("Minimum Experience:")').closest('.row').find('div.col-lg-7').text().trim() || 'N/A',
                            Apply_Before: $('b:contains("Apply Before:")').closest('.row').find('div.col-lg-7').text().trim() || 'N/A',
                            Posting_Date: $('b:contains("Posting Date:")').closest('.row').find('div.col-lg-7').text().trim() || 'N/A',
                        };

                        console.log('Scraped job:', jobInfo);

                        // Write the job data to the CSV file
                        await csvWriter.writeRecords([jobInfo]);

                    } catch (error) {
                        console.error(`Error scraping job at ${link}:`, error);
                    } finally {
                        await tab.close();
                    }
                })
            );
        }

        //this below command Check if the "Next" button is available or not
        const hasNextPage = await mainPage.$('a.next');
        if (hasNextPage) {
            console.log('Moving to the next page...');
            await Promise.all([
                mainPage.click('a.next'),
                mainPage.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            ]);
        } else {
            console.log('No more pages to scrape.');
            break;
        }
    } while (true);

    console.log('Scraping completed! Data saved to job_data.csv.');
    await browser.close();
})();
