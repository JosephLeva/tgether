import React from 'react'
import { Row, Col } from 'react-bootstrap'
function ContractWidget() {
    
    return (
        <div>
            <div className="card text-white border-primary bg-dark mb-3" style={{ maxWidth: "98%", margin: "auto" }}>
                <div className="card-body ">
                    <Row style={{ marginBottom: "3vh" }}>
                        <h1 style={{ textAlign: "center" }}> Create Your Contract</h1>
                    </Row>
                    <Row>

                        <Col>
                            <div className="input-group ml-20" >

                                <input type="text" className="form-control" placeholder="Recipient's username" style={{ maxWidth: "95%" }} aria-label="Recipient's username" aria-describedby="button-addon2" wtx-context="268DF588-CE13-4D87-8DD4-0E8E8CD1D4BF" />
                                <button type="button" className="btn btn-primary btn-sm"><i className="fas fa-plus"></i>

                                </button>


                            </div>



                        </Col>
                        <Col>

                            <div className="form-group">
                                <div className="input-group mb-3">
                                    <span className="input-group-text">$</span>
                                    <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" wtx-context="A5177AFF-6A2A-4352-A199-7D1A52EAE472" />
                                    <button type="button" className="btn btn-primary btn-sm"><i className="fa fa-calendar" aria-hidden="true"></i></button>
                                </div>
                            </div>




                        </Col>
                    </Row>
                    <Row>
                        <table className="table table-hover" style={{ maxWidth: "80%", margin: "auto", position: "relative" }}>
                            <thead>
                                <tr>
                                    <th scope="col">Username</th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                    <th scope="col" >Amount</th>



                                </tr>
                            </thead>
                            <tbody>
                                <tr className="table-primary">
                                    <th scope="row">Joe</th>
                                    <td></td>
                                    <td></td>
                                    <td style={{}}>
                                        <input type="text" className="form-control" placeholder="Amount" id="inputDefault" style={{ maxWidth: "200px" }} wtx-context="9A05EF30-5D9B-43D3-84B6-C9091F898755" />
                                    </td>


                                </tr>
                                <tr className="table-primary">
                                    <th scope="row">Joe</th>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <input type="text" className="form-control" placeholder="Amount" id="inputDefault" style={{ maxWidth: "200px" }} wtx-context="9A05EF30-5D9B-43D3-84B6-C9091F898755" />
                                    </td>

                                </tr>
                                <tr className="table-primary">
                                    <th scope="row">Joe</th>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <input type="text" className="form-control" placeholder="Amount" id="inputDefault" style={{ maxWidth: "200px" }} wtx-context="9A05EF30-5D9B-43D3-84B6-C9091F898755" />
                                    </td>

                                </tr>
                            </tbody>


                        </table>

                    </Row>
                    <Row>
                        <Col></Col><Col><h6 className="text-danger">Amount Outstanding: $3.99</h6></Col>
                    </Row>
                    <Row>

                        <button type="button" className="btn btn-secondary" style={{ maxWidth: "20vw", margin: "auto", marginTop: "3vh" }}>Agree</button>


                    </Row>


                </div>
            </div>

        </div>
    )
}

export default ContractWidget
