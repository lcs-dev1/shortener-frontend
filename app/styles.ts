"use client";
import styled from "styled-components";

export const Navbar = styled.nav`
  background-color: #fff;
  text-align: center;
  padding: 10px;

  h2 {
    font-family: var(--patrick-hand), monospace;
    font-size: 2rem;

    span {
      color: #00c0ff;
    }
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
  width: 100%;
`;

export const ShortUrl = styled.div`
  background-color: #fff;
  padding: 20px;
  max-width: 1500px;
  width: 900px;
  border-radius: 6px;
  margin: 0 10px;
  min-width: 0px;
  @media only screen and (max-width: 650px) {
    padding: 10px;
  }
`;

export const ShortContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ShortHead = styled.div`
  display: flex;
`;

export const ShortBody = styled.div``;

export const LinkContainer = styled.div`
  background-color: #71bef1a6;
  padding: 10px;
  margin: 10px;
  border-radius: 6px;
  p {
    display: flex;
    align-items: center;
    margin-top: 10px;
    span {
      margin-left: 5px;
      max-width: 90%;
      overflow-wrap: break-word;
    }
  }

  b {
    display: flex;
    color: #073079;
  }

  @media only screen and (max-width: 650px) {
    p {
      display: none;
    }
  }
`;

export const ActionsCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
  }

  @media only screen and (max-width: 650px) {
    flex-direction: column;
    justify-content: left;
    align-items: flex-start;
  }
`;

export const PcButton = styled.button`
  display: flex;
  background: none;
  border: none;
  margin-left: 8px;
  font-size: 17px;
  cursor: pointer;
  @media only screen and (max-width: 650px) {
    display: none;
  }
`;

export const MobileButton = styled.button<{color: string;}>`
  display: none;
  @media only screen and (max-width: 650px) {
    display: flex;
    width: 100%;
    padding: 5px 0;
    justify-content: center;
    margin-top: 15px;
    background-color: ${props => props.color};
    border: none;
    border-radius: 6px;
    color: #fff;
    font-weight: bold;
    svg {
      margin-left: 5px;
    }
    transition: all 300ms;
  }
`;
