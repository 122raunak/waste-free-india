import React from "react";
import styled from "styled-components";

const SvgBtn = () => {
  return (
    <StyledWrapper>
      <button>
        <div className="svg-wrapper-1">
          <div className="svg-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={24}
              height={24}
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                fill="currentColor"
                d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
              />
            </svg>
          </div>
        </div>
        <span>Get Started</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    font-size: 20px;
    background: #37b943; /* green background */
    color: white; /* text color */
    padding: 0.7em 1em; /* spacing */
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 12px; 
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); 
    font-weight: 600; 
    width: 100%; /* w-full */
    height: 58px; 
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
  }

  button span {
    display: block;
    margin-left: 0.3em;
    transition: all 0.3s ease-in-out;
  }

  button svg {
    display: block;
    transform-origin: center center;
    transition: transform 0.3s ease-in-out;
  }

  button:hover .svg-wrapper {
    animation: fly-1 0.6s ease-in-out infinite alternate;
  }

  button:hover svg {
    transform: translateX(1.2em) rotate(45deg) scale(1.1);
  }

  button:hover span {
    transform: translateX(7rem);
  }

  button:active {
    transform: scale(0.95);
  }

  @keyframes fly-1 {
    from {
      transform: translateY(0.1em);
    }

    to {
      transform: translateY(-0.1em);
    }
  }
`;

export default SvgBtn;
