import styled from 'styled-components';
import { Button } from '../Basic/Button/Button';
import { device } from '../../style';


export const MenuWrapper = styled.div`
    z-index: 2;
    background-color: ${(props) => props.theme.bg};
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    color: ${(props) => props.theme.text1};
    transition: all 0.6s ease-in-out 0s;

    @media ${device.xs_sm}{
        width: 100%;
    }
`;


export const MenuBox = styled(Button)`
    z-index: 2;
    background-color: ${(props) => props.theme.paper};
    width: 100%;
    display: flex;
    margin: 0px 0px 28px;
    padding: 20px 10px;
    justify-content: space-around;
    align-items: center;
    font-family: "Rajdhani";
    color: ${(props) => props.theme.text1};
    transition: all 0.6s ease-in-out 0s;
    
    @media ${device.xs_sm}{
        display: flex;
    }
    
    @media ${device.web}{
        &:hover{
            background-color: ${(props) => props.theme.tertiary};
            color: ${(props) => props.theme.primary};
        }
    }
`;
