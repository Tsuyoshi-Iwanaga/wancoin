import { AppBar, Box, Container, Toolbar, Typography, styled} from "@mui/material"
import PetsIcon from '@mui/icons-material/Pets';

const HeaderContainer = styled(Container)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  background: 'green',
})

const HeaderTitleWrap = styled(Box)({
  display: 'flex',
  alignItems: 'center',
})

const HeaderTitleText = styled(Typography)({
  paddingLeft: '0.2em',
  fontSize: 30,
  fontWeight: 'bold',
  fontFamily: 'Montserrat, sans-serif',
})

const Header = () => {
  return (
    <AppBar>
      <Toolbar>
        <HeaderContainer maxWidth="md">
          <HeaderTitleWrap>
            <PetsIcon fontSize="large" />
            <HeaderTitleText>wancoin</HeaderTitleText>
          </HeaderTitleWrap>
        </HeaderContainer>
      </Toolbar>
    </AppBar>
  )
}
export default Header