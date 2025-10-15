const MetricWidget = ({ 
    widget
}) => {
    return (
        <div>
            <h3>{widget.label}</h3>
            <p>{widget.value}</p>
        </div>
    );
};

export default MetricWidget;