import * as express from 'express'
import * as path from 'path'
import * as fs from  'fs' ;
import * as webpackHotMiddleware from 'webpack-hot-middleware'
import * as webpackDevMiddleware from 'webpack-dev-middleware'
import * as webpack from 'webpack'

// types import
import {
  Application,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express'
import { Options as DevMiddlewareOptions  } from 'webpack-dev-middleware'
import { Options as HotMiddlewareOptions } from 'webpack-hot-middleware'
import { Configuration, Compiler } from 'webpack'

// consts
const PORT: number = parseInt(process.env.PORT) || 3000
const ENV: string = process.env.ENV || 'development'
const WEBPACK_CONFIG_PATH: string = path.join(
  process.cwd(),
  'webpack.config.js',
)

// logger
function RequestLogger(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  console.info(`Request time: ${new Date()}`)
  console.info(`Request url: ${request.originalUrl}`)
  next()
}

// app
const app: Application = express()



// middlewares

const webpackConfig: Configuration = require(WEBPACK_CONFIG_PATH)
const webpackCompiler: Compiler = webpack(webpackConfig)


webpackCompiler.plugin('done',()=>{
  const memoryFs = devMiddleware.fileSystem

  const cssFilename: string= 'style.css'
  const cssFile: Buffer = fs.readFileSync(path.join('assets',cssFilename))
  memoryFs.data = {
    ...memoryFs.data,
    [cssFilename] : cssFile
  }
})


const devMiddleware : any = webpackDevMiddleware(webpackCompiler, <DevMiddlewareOptions>{
  publicPath: webpackConfig.output.publicPath,
  watchOptions: {
    aggregateTimeout: 300,
    poll: true,
  },
  stats: {
    colors: true,
  },
})


app.use(devMiddleware)

app.use(
  webpackHotMiddleware(webpackCompiler, <HotMiddlewareOptions>{
    log: false,
    path: '/__webpack_hmr'
  }),
)

app.use(RequestLogger)

// request handlers
class Handlers {
  public static FrontHandler: RequestHandler = (
    req: Request,
    res: Response,
  ) => {
    res.sendFile(path.join(process.cwd(), 'index.html'))
  }

  public static TestHandler: RequestHandler = (req: Request, res: Response) => {
    res.json({ server: `is running on port ${PORT}...` })
  }
}

app.get('/', Handlers.FrontHandler)
app.get('/test', Handlers.TestHandler)


// mounting the server 
app.listen(PORT, () => {
  console.log(`${ENV} server is running on port: ${PORT}`)
})
