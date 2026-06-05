cmake_minimum_required (VERSION 3.8)
project (ros2_cpp)


add_executable(ros2_cpp_node ros2_cpp_node.cpp)
# 查找rclcpp头文件和库文件的路径
find_package(rclcpp REQUIRED) 

#第一个参数是输出信息的类型，第二个参数是要输出的信息
message(STATUS "rclcpp include directories: ${rclcpp_INCLUDE_DIRS}") # 输出rclcpp及rclcpp依赖的头文件路径
message(STATUS "rclcpp libraries: ${rclcpp_LIBRARIES}") # 输出rclcpp及rclcpp依赖的库文件路径

# 给可执行文件包含头文件，第一个参数是目标文件名，第三个参数是头文件路径，头文件的依赖，
target_include_directories(ros2_cpp_node PUBLIC ${rclcpp_INCLUDE_DIRS})
# 给可执行文件链接库文件
target_link_libraries(ros2_cpp_node ${rclcpp_LIBRARIES})
