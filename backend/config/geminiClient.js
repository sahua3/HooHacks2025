import axios from "axios";

const geminiClient = {
  send: async (prompt) => {
    const res = await axios.post("http://localhost:3002/chat", {
      message: prompt,
    });

    return res.data;
  },
};

export default geminiClient;
