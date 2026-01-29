import React from "react";
import styled from "styled-components";
import "../styles/global.css";


const Container = styled.div`
  text-align: center;
  padding: 60px 30px;
  margin: 80px auto;
  max-width: 850px;
  background: rgba(255, 240, 245, 0.6);
  border: 2px solid rgba(255, 182, 193, 0.3);
  border-radius: 25px;
  box-shadow: 0 8px 30px rgba(255, 105, 180, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  animation: fadeInUp 1.2s ease-out;
`;

const Title = styled.h1`
  color: #cc007a;
  font-size: 3rem;
  margin-bottom: 25px;
  font-family: 'Poppins', sans-serif;
  text-shadow: 1px 1px 2px rgba(204, 0, 122, 0.2);
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #333;
  font-family: 'Open Sans', sans-serif;
  line-height: 1.7;
  padding: 0 15px;
  color: #5a5a5a;
`;

const Emoji = styled.span`
  font-size: 1.5rem;
`;

const Home = () => {
  return (
    <Container>
      <div class="main-content">
      <Title>Welcome to the AI Mental Health Assistant 🌸</Title>
      <Description>
        <Emoji>🧘‍♀️</Emoji> Chat with a virtual therapist, unwind with calming sounds, and take steps toward better mental wellness.
      </Description>
      </div>
    </Container>
    
  );
};

export default Home;
