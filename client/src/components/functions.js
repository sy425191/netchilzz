const TrimVar = ({ prop, length }) => {
  if (prop.length > length) {
    return prop.substring(0, length) + "...";
  } else {
    return prop;
  }
};


const date_to_days = (date) => {
    const dateObj = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today - dateObj); // seconds

    switch (true) {
        case diffTime < 60000:
            return "just now";
        case diffTime < 3600000:
            return Math.floor(diffTime / 60000) + " minutes ago";
        case diffTime < 86400000:
            return Math.floor(diffTime / 3600000) + " hours ago";
        case diffTime < 604800000:
            return Math.floor(diffTime / 86400000) + " days ago";
        case diffTime < 2419200000:
            return Math.floor(diffTime / 604800000) + " weeks ago";
        case diffTime < 29030400000:
            return Math.floor(diffTime / 2419200000) + " months ago";
        default:
            return Math.floor(diffTime / 29030400000) + " years ago";
    }

};

module.exports = {
    TrimVar,
    date_to_days
};