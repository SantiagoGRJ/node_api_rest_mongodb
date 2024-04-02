const express = require('express')
const router = express.Router()
const Book = require('../models/book.model')

//MIDDLEWARE
const getBook = async (req, res, next) => {
    let book;
    const {
        id
    } = req.params

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message: "Id no valido"
        })
    }

    try {
        book = await Book.findById(id)
        if (!book) {
            return res.status(404).json({
                message: "El libro no encontrado"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })

    }

    res.book = book
    next()

}

// get All Books

router.get('/', async (req, res) => {
    try {
        const books = await Book.find()
        console.log('GET ALL', books)
        if (books.length === 0) {
            res.status(204).json([])
        }
        res.json(books)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
})

// POST NEW BOOK (Resource) [POST]

router.post('/', async (req, res) => {
    let {
        title,
        author,
        genre,
        publication_date
    } = req ?.body
    if (!title || !author || !genre || !publication_date) {

        return res.status(400).json({
            message: 'Faltan campos'
        })
    }

    const book = new Book({
        title,
        author,
        genre,
        publication_date
    })

    try {
        const newBook = await book.save()
        res.status(201).json(newBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.get('/:id', getBook, async (req, res) => {
    res.json(res.book);
})

router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.genre = req.body.genre || book.genre
        book.publication_date = req.body.publication_date || book.publication_date

        const updatedBook = await book.save()
        res.json(updatedBook)


    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
})

router.patch('/:id', getBook, async (req, res) => {
    if(!req.body.title && !req.body.author && !req.body.genre  && !req.body.publication_date){
        res.status(400).json({
            message:"Al menos unos de los campos deben se enviados (title, author, genre o publication date)"
        })
    }
    try {
        const book = res.book
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.genre = req.body.genre || book.genre
        book.publication_date = req.body.publication_date || book.publication_date

        const updatedBook = await book.save()
        res.json(updatedBook)


    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
})

router.delete('/:id',getBook,async(req,res)=>{
    try {
        const book = res.book
        await book.deleteOne({
            _id:book._id
        })
        res.json({
            message:`El libro ${book.title} fue eliminado correctamente`
        })

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
})

module.exports = router