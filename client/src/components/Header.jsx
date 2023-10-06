import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Header = ({ login }) => {
    const navigate = useNavigate();

    return (
        <Container className='flex a-center j-between'>
            <div className="logo">
                <p>CineFlix</p>
            </div>
            <button onClick={() => navigate(login ? "/login" : "/signup")} >{login ? "Sign In" : "Sign Up"}</button>
        </Container>
    );
}

const Container = styled.div`
    padding: 0 2rem;
    .logo{
        img{
            height: 5rem;
        }
        p{
            font-size: 2.5rem;
            font-weight: 700;
            letter-spacing: 0.15rem;
            color: #06c4bd;
        }
    }
    button{
        padding: 0.5rem 1rem;
        background-color: #06c4bd;
        border: none;
        cursor: pointer;
        color: white;
        border-radius: 0.2rem;
        font-weight: bolder;
        font-size: 1.05rem;
    }
`;

export default Header;