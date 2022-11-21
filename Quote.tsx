import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Text,
} from 'react-native-paper';

export default function Quote(props) {
  const [quote, setQuote] = useState({ text: "", attribution: "" });

  const updateQuote = () => {
    axios
      .get(props.url + ".json", {})
      .then(response => {
        const data = response.data;
        setQuote({ text: data.text_en, attribution: data.attribution });
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  useEffect(() => updateQuote(), []);

  return (
    <Text variant='bodySmall' onPress={() => {return updateQuote() }} className="quotes">
      {quote.text} ({quote.attribution})
    </Text>
  );
}
Quote.propTypes = {
  url: PropTypes.string
};
