const Notification = ({ notification, type }) => {
    if (notification === null) {
        return null
    }

    return (
        <div className={type}>
            {notification}
        </div>
    )
}

export default Notification