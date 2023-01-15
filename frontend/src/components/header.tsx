import { AppBar, Box, Container, Toolbar, Typography, styled} from "@mui/material"
import PetsIcon from '@mui/icons-material/Pets';

const HeaderOutline = styled(AppBar)({
  backgroundColor: '#4f351b',
  marginBottom: 30,
})

const HeaderContainer = styled(Container)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
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
    <HeaderOutline position="static">
      <Toolbar>
        <HeaderContainer maxWidth="md">
          <HeaderTitleWrap>
            <PetsIcon fontSize="large" />
            <HeaderTitleText>wancoin</HeaderTitleText>
          </HeaderTitleWrap>
        </HeaderContainer>
      </Toolbar>
    </HeaderOutline>
  )
}
export default Header