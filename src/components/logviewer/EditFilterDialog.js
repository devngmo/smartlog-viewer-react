import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";

const EditFilterDialog = ({initName, show, title, onClose, onSave}) => {
    const handleClose = () => onClose();
    const [filterName, setFilterName] = useState(initName);

    return (
        <div className="modal show"
        style={{display:'block', position: 'initial'}}
        >
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>

            <div className="input-group mb-3">
                <span className="input-group-text" id="filter-name">Name</span>
                <input value={filterName} onChange={(e) => setFilterName(e.target.value)} type="text" className="form-control" placeholder="Filter name" aria-label="Filter name" aria-describedby="filter-name"/>
            </div>

            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="primary" onClick={() => onSave(filterName)}>Save</Button>
            </Modal.Footer>

        </Modal>
        

        </div>
    );
};
export default EditFilterDialog;