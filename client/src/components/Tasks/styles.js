// Node modules.
import styled from "styled-components";

export const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  max-width: 600px;
  width: 100%;

  h1 {
    color: #616161;
    font-size: 2rem;
    margin: 0 0 10px;
    padding: 0;
  }

  .empty {
    align-items: center;
    align-self: center;
    display: flex;
    flex-direction: column;
    margin: calc(50vh - 150px) 0 0;

    img {
      height: 45px;
      width: 45px;
    }

    p {
      color: #ffffff;
      font-size: 1.2rem;
      margin: 5px 0 0;
    }
  }

  ul {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding: 10px 10px 10px 0;
    width: 100%;

    li {
      align-items: center;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border: 2px solid #343434;
      display: flex;
      margin: 20px 0 0;
      padding: 10px;
      width: 100%;

      &:first-of-type {
        margin-top: 0;
      }

      img {
        height: 45px;
        margin-right: 10px;
        width: 45px;
      }

      .info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        .text {
          color: #ffffff;
          margin: 10px 0;
          line-height: 1;

          &.completed {
            text-decoration: line-through;
          }
        }

        .owner {
          font-size: 0.7rem;
          margin: 0;
          line-height: 1;
        }

        .expiration {
          align-items: center;
          display: flex;
          font-size: 0.7rem;
          line-height: 0;
          margin: 0;

          img {
            height: 10px;
            margin-right: 5px;
            width: 10px;
          }
        }

        p {
          color: #616161;
          margin: 5px 0 0;

          &:first-child {
            margin-top: 0;
          }
        }
      }

      .actions {
        align-items: center;
        display: flex;

        img {
          cursor: pointer;
          height: 30px;
          margin: 0;
          width: 30px;

          &:first-of-type {
            height: 37px;
            margin-right: 10px;
            width: 37px;

            &.completed {
              height: 30px;
              width: 30px;
            }
          }
        }
      }
    }
  }
`;
