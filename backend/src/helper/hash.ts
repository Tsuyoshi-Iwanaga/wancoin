const bcrypt = require('bcrypt');

const passwordHandler = {
  hash: (password: string) => {
    return bcrypt.hashSync(password, 10)
  },
  compare: (password: string, hashed_password: string) => {
    return bcrypt.compareSync(password, hashed_password)
  }
}
export default passwordHandler