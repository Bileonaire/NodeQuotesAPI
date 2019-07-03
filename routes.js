const express = require('express');
const router = express.Router();
const records = require('./records');

// Takes a function raps it in a try catch block and passes any errors to the
// global error handler. To avoid try catch blocks in the endpoint code blocks
function asyncHandler(cb) {
	return async (req, res, next) => {
		try {
			await cb(req, res, next);
		} catch (err) {
			next(err);
		}
	};
}

// send a get request to /quotes read a list of quotes
router.get('/quotes', async (req, res) => {
	const quotes = await records.getQuotes();
	res.json(quotes);
});

// send a get request to /qoute/id read a quote
router.get(
	'/quotes/:id',
	asyncHandler(async (req, res) => {
		const quotes = await records.getQuote(req.params.id);
		if (quotes) {
			res.json(quotes);
		} else {
			res.status(404).json({ message: 'Quote Not Found' });
		}
	})
);

// send a post request to /qoutes create a post
router.post(
	'/quotes',
	asyncHandler(async (req, res) => {
		if (req.body.quote && req.body.author) {
			const quote = await records.createQuote({
				quote: req.body.quote,
				author: req.body.author,
			});
			res.status(201).json(quote);
		} else {
			res.status(400).json({ message: 'Quote and Author are required' });
		}
	})
);

// send a put request to /qoute/id edit a post
router.put(
	'/quotes/:id',
	asyncHandler(async (req, res) => {
		if (req.body.quote || req.body.author) {
			const quote = await records.getQuote(req.params.id);
			if (quote) {
				quote.quote = req.body.quote;
				quote.uthor = req.body.author;
				await records.updateQuote(quote);
				res.status(204).end();
			} else {
				res.status(404).json({
					message: 'Quote Not Found',
				});
			}
		}
	})
);

// send a Delete request to /qoute/id delete a quote
router.delete(
	'/quotes/:id',
	asyncHandler(async (req, res) => {
		const quote = await records.getQuote(req.params.id);
		if (quote) {
			await records.deleteQuote(quote);
			res.status(200).json({
				message: 'Quote Deleted',
			});
		} else {
			res.status(404).json({
				message: 'Quote Not Found',
			});
		}
	})
);

// Send a Get request to /qoutes/quote/random ger a random quote
router.get(
	'/quotes/quote/random',
	asyncHandler(async (req, res) => {
		const quote = await records.getRandomQuote();
		if (quote) {
			res.status(200).json(quote);
		} else {
			res.status(404).json({
				message: 'There is no Quote',
			});
		}
	})
);

module.exports = router;