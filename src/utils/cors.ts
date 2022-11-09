export const cors = (req: any, res: { header: (arg0: string, arg1: string) => void }, next: () => void) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  next()
}
