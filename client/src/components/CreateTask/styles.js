// Node modules.
import styled from "styled-components";

export const Wrapper = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 500px;
  width: 100%;

  h1 {
    color: #616161;
    font-size: 2rem;
    margin: 0 0 20px;
    padding: 0;
  }

  label {
    color: #ffffff;
    font-size: 1.2rem;
    margin: 40px 0 15px;

    &:first-of-type {
      margin-top: 0;
    }
  }

  textarea {
    margin: 0;
  }

  ul {
    display: flex;
    flex-flow: row wrap;
    padding: 0;

    li {
      align-items: center;
      display: flex;
      flex-direction: column;
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }

      &.selected {
        img {
          border-radius: 50%;
          outline: 2px solid #ffffff;
        }

        p {
          color: #ffffff;
        }
      }

      img {
        height: 50px;
        margin-bottom: 10px;
        width: 50px;
      }

      p {
        color: #616161;
        font-size: 0.8rem;
        transition: color 0.5s ease;
      }
    }

    &.expires {
      li {
        color: #616161;

        &.selected {
          color: #ffffff;
        }
      }
    }
  }

  button {
    margin: 40px 0 0;
  }
`;
