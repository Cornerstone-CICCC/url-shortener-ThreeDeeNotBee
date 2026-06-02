import express, { Request, Response } from 'express'
import { urlencoded } from 'express'
import { generate } from 'shortid'

const PORT = 3241
const app = express()

app.set('view engine', 'ejs')
app.use(urlencoded({ extended: true }))

const urlDatabase: Record<string, { full: string; clicks: number }> = {}

app.get('/', (req: Request, res: Response) => {
  const shortUrls = Object.entries(urlDatabase).map(
    ([short, { full, clicks }]) => ({
      full,
      short,
      clicks,
    }),
  )
  res.render('index', { shortUrls })
})

app.post('/shortUrls', (req: Request, res: Response) => {
  const { fullUrl } = req.body

  if (!fullUrl) {
    res.status(400).send('URL is required')
    return
  }
  const shortId = generate()
  urlDatabase[shortId] = { full: fullUrl, clicks: 0 }
  res.redirect('/')
})

app.get('/:shortUrl', (req: Request, res: Response) => {
  const { shortUrl } = req.params
  const urlEntry = urlDatabase[shortUrl]
  if (urlEntry) {
    urlEntry.clicks++
    res.redirect(urlEntry.full)
  } else {
    res.sendStatus(404)
  }
})

app.listen(PORT, () => console.log('Server started on port ', PORT))
