export const cors = (req: any, res, next: () => void) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', true)

  next()
}
