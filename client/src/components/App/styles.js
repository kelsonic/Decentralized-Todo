// Node modules.
import styled from "styled-components";

export const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  position: relative;

  .chain-warning-background {
    align-items: center;
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    margin: 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 10001;

    .chain-warning {
      align-items: center;
      background: #000000;
      border: 1px solid rgb(0, 0, 0);
      box-shadow: rgb(255 255 255 / 10%) 0px 8px 8px;
      display: flex;
      flex-direction: column;
      text-align: center;
      padding: 20px;

      h2 {
        align-items: center;
        display: flex;
        font-size: 1.5rem;
        margin: 0 0 10px;

        img {
          height: 25px;
          margin-right: 5px;
          width: 25px;
        }
      }

      p {
        font-size: 0.8rem;
        margin: 0;
      }
    }
  }
`;
