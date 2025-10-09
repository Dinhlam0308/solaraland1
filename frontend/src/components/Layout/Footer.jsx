import "../../assets/css/Footer.css"

const Footer = () => {
    return (
        <footer>
            <div className="container text-md-left">
                <div className="row text-md-left">
                    {/* Về chúng tôi + logo */}
                    <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
                        <div className="d-flex align-items-center mb-3">
                            <img src="/images/Logo.png" alt="Logo công ty" />
                            <h5 className="text-uppercase mb-0">Về chúng tôi</h5>
                        </div>
                        <p>
                            Công ty chúng tôi chuyên cung cấp dịch vụ chất lượng cao, đặt uy tín và sự hài lòng của khách hàng lên
                            hàng đầu.
                        </p>
                    </div>

                    {/* Địa chỉ */}
                    <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
                        <h5 className="text-uppercase mb-4">Địa chỉ</h5>
                        <p>Sunrise Riverside Block A, đường Nguyễn Hữu Thọ, Nhà Bè, Thành Phố Hồ Chí Minh</p>
                    </div>

                    {/* Liên hệ */}
                    <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
                        <h5 className="text-uppercase mb-4">Liên hệ</h5>
                        <p>
                            Nếu bạn có bất kỳ câu hỏi nào, vui lòng <a href="/lien-he">liên hệ với chúng tôi</a>.
                        </p>
                    </div>
                </div>

                <hr className="mb-4" />

                <div className="row align-items-center">
                    <div className="col-md-12 col-lg-12 text-center">
                        <p className="text-muted mb-0">© 2025 Solaraland. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer