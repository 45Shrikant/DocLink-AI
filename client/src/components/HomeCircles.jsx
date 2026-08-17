import React from "react";
import CountUp from "react-countup";
import "../styles/homecircles.css";
import { FaUserCheck, FaUserMd, FaHospitalAlt } from "react-icons/fa";

const HomeCircles = () => {
  return (
    <section className="circles-section">
      <div className="circles">
        <div className="circle-card">
          <div className="circle-icon">
            <FaUserCheck />
          </div>
          <CountUp
            start={0}
            end={10000}
            delay={0}
            enableScrollSpy={true}
            scrollSpyDelay={200}
          >
            {({ countUpRef }) => (
              <div className="counter">
                <span ref={countUpRef} />+
              </div>
            )}
          </CountUp>
          <span className="circle-name">Satisfied Patients</span>
        </div>

        <div className="circle-card">
          <div className="circle-icon">
            <FaUserMd />
          </div>
          <CountUp
            start={0}
            end={250}
            delay={0}
            enableScrollSpy={true}
            scrollSpyDelay={200}
          >
            {({ countUpRef }) => (
              <div className="counter">
                <span ref={countUpRef} />+
              </div>
            )}
          </CountUp>
          <span className="circle-name">Verified Doctors</span>
        </div>

        <div className="circle-card">
          <div className="circle-icon">
            <FaHospitalAlt />
          </div>
          <CountUp
            start={0}
            end={75}
            delay={0}
            enableScrollSpy={true}
            scrollSpyDelay={200}
          >
            {({ countUpRef }) => (
              <div className="counter">
                <span ref={countUpRef} />+
              </div>
            )}
          </CountUp>
          <span className="circle-name">Specialist Departments</span>
        </div>
      </div>
    </section>
  );
};

export default HomeCircles;
