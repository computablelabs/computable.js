contract TestableNow {

    /* Time override. Set to non-zero to allow test different moments. */
	uint _current = 0;

    /** Override current() for testing */
    function current() public returns (uint) {

        // Override not in use
        if(_current == 0) {
            return now;
        }

        return _current;
    }

    function setCurrent(uint __current) {
        _current = __current;
    }

}
